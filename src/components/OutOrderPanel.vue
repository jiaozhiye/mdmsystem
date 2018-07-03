<template>
<div class="out-order-panel">
    <section class="material-tree-box">
        <el-input
            placeholder="输入原材料名称/批号/拼音头" 
            prefix-icon="el-icon-search" 
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree" 
            ref="tree" 
            show-checkbox 
            :data="treeList" 
            v-loading="treeLoading"
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check="checkHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="out-order-box">
        <div class="appManager-top tr">
            <el-button type="primary" @click.stop="outDepotSaveHandle" :loading="btnLoading">出库</el-button>
            <!-- <el-button type="primary" @click.stop="saveOutOrderHandle" :loading="btnLoading">保存</el-button> -->
        </div>
        <div style="margin: 20px 0;">
            <el-table class="out-order-table" ref="table" :data="list" border v-loading="loading">
                <el-table-column prop="name" label="名称" min-width="150" fixed></el-table-column>
                <el-table-column prop="code" label="物料编号"></el-table-column>
                <el-table-column prop="want_num" label="订货数量"></el-table-column>
                <el-table-column prop="unit" label="订货单位"></el-table-column>
                <el-table-column prop="security_stock" label="安存数量"></el-table-column>
                <el-table-column label="批号" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.batch_code }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="规格" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.attribute_2_text }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库存数量" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.warehouseStockNumber }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="发货数量" width="140" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <EditNumber
                            v-for="(item, key) in scope.row.warehouseStockInfo"
                            :key="key"
                            v-model.number="item.send_number"
                            :stepVal="1"
                            :minVal="0"
                            :maxVal="item.warehouseStockNumber">
                        </EditNumber>
                    </template>
                </el-table-column>
                <el-table-column label="提货单位" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.out_unit }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" label-class-name="split-column-th" class-name="split-column" fixed="right">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">
                            <el-button @click.stop="removeItemHandle(item.material_id, item.batch_code)" type="text">
                                <i class="el-icon-delete"></i> 移除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</div>
</template>

<script>
import { recursionTree } from 'assets/js/tools'
import EditNumber from './EditNumber.vue'
import { mapActions, mapState } from 'vuex'

import { getMaterialTreeForOutDepot, getOutOrderDetail, closeOutOrder, outDepotSaveOrder } from 'api'

export default {
    name: 'OutOrderPanel',
    props: {
        params: Object
    },
    data(){
        return {
            treeList: [], // 原材料树 数组
            list: [], // table 数据
            referData: [], // 用于对比的数据
            treeLoading: false,
            loading: false,
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            contrasts: [] // 用于和 checkedKeys 对比的数组
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val)
        },
        list: {
            handler(newVal, oldVal){
                if (!_.isEqual(newVal, this.referData)){ // 数据改变了
                    this.setLeaveRemind(!0)
                } else {
                    this.setLeaveRemind(!1)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['setLeaveRemind']),
        asyncTableList(data, bool){
            if (!bool){ // 执行删除 table 记录
                this.deleteTableRecord(data.id)
            } else { // 执行插入
                let index = -1
                // 深拷贝一份 data 数据
                let _data = _.cloneDeep(data)
                this.list.forEach((item, key) => {
                    if (data.name === item.name){ // 已经添加过了
                        index = key
                        item.warehouseStockInfo.push(_data)
                    }
                })
                if (index === -1){ // 首次添加
                    _data.warehouseStockInfo = [_.cloneDeep(_data)]
                    this.list.push(_data)
                }
            }
            // let _arr = []
            // recursionTree(this.treeList, item => {
            //     if (this.checkedKeys.findIndex(val => val === item.id) !== -1){
            //         // _arr 元素的name 等于 选中树结构元素的name , 说明该原材料已经添加过了
            //         let index = _arr.findIndex(obj => obj.name === item.name)
            //         if (index !== -1){ // 已经添加过了
            //             _arr[index].warehouseStockInfo.push(item)
            //         } else { // 首次添加
            //             item.warehouseStockInfo = [item]
            //             _arr.push(item)
            //         }
            //     }
            // })
            // this.list = _arr
        },
        checkHandle(data, state){
            // 当分类树选中状态有变化，重置 checkedKeys 数组
            this.getCheckedKeys()
            
            if (this.checkedKeys.length > this.contrasts.length){ // 将要执行新增
                let _arr = this.checkedKeys.filter(item => this.contrasts.findIndex(val => val === item) === -1)
                state.checkedNodes.forEach(item => {
                    if (_arr.findIndex(val => val === item.id) !== -1){
                        this.asyncTableList(item, true) // 执行插入
                    }
                })
            } else { // 将要执行删除
                let _arr = this.contrasts.filter(item => this.checkedKeys.findIndex(val => val === item) === -1)
                recursionTree(this.treeList, item => {
                    if (_arr.findIndex(val => val === item.id) !== -1){
                        this.asyncTableList(item, false) // 执行删除
                    }
                })
            }

            // 设置 checkedKeys 的对比数组
            this.setContrasts()

            // 判断执行 asyncTableList 方法
            // if (this.checkedKeys.findIndex(item => item === data.id) !== -1){ // 选中
            //     this.asyncTableList(data, true) // 执行插入
            // } else {
            //     this.asyncTableList(data, false) // 执行删除
            // }
        },
        getCheckedKeys(){
            // 重置选中树的ID数组 - 过滤掉一级二级分类
            // this.checkedKeys = this.$refs.tree.getCheckedKeys(true)
            this.checkedKeys = this.$refs.tree.getCheckedNodes().filter(item => item.isEdit).map(item => item.id)
            // console.log(this.checkedKeys)
        },
        setCheckedKeys(){
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
        },
        setContrasts(){
            this.contrasts = _.cloneDeep(this.checkedKeys)
        },
        filterNode(value, data){
            if (!value) return true
            return data.search_text.indexOf(value) !== -1
        },
        removeItemHandle(materialId, batchCode){ // 原材料ID  批号
            // 处理 checkedKeys 数组
            this.checkedKeys.splice(this.checkedKeys.findIndex(item => item === `${materialId}-${batchCode}`), 1)
            // 重置结构树的选中状态
            this.setCheckedKeys()
            // 移除 table 数据记录
            this.deleteTableRecord(`${materialId}-${batchCode}`)
        },
        async getMaterialTree(callback){
            try {
                this.treeLoading = !0
                const response = await getMaterialTreeForOutDepot({ warehouseId: this.params.depotId })
                // recursionTree(response.data.list, item => {
                //     // 禁用一二级分类项
                //     if (!item.isEdit) item.disabled = true
                // })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.treeList = response.data.list
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.treeLoading = !1
        },
        async getOutOrderInfo(callback){
            try {
                this.loading = !0
                const response = await getOutOrderDetail({ id: this.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                    // 把编辑过的原材料同步到左侧树
                    // recursionTree(this.treeList, item => {
                    //     this.list.forEach(val => {
                    //         let obj = val.warehouseStockInfo.find(ele => ele.id === item.id)
                    //         if (typeof obj !== 'undefined'){
                    //             for (let attr in obj) item[attr] = obj[attr]
                    //         }
                    //         obj = null
                    //     })
                    // })
                    // 设置对比数据
                    this.referData = _.cloneDeep(this.list)
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async outDepotSave(callback){
            try {
                const response = await outDepotSaveOrder({ id: this.params.id, list: this.list })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async saveOutOrder(callback){
            try {
                const response = await closeOutOrder({ id: this.params.id, list: this.list })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        outDepotSaveHandle(){
            this.outDepotSave(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        saveOutOrderHandle(){
            this.saveOutOrder(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.setLeaveRemind(!1)
            this.params.isPlay = false
        },
        deleteTableRecord(_id){
            for (let i = 0; i < this.list.length; i++){
                let index = -1
                for (let k = 0; k < this.list[i].warehouseStockInfo.length; k++){
                    if (this.list[i].warehouseStockInfo[k].id === _id){
                        index = k
                        this.list[i].warehouseStockInfo.splice(k--, 1)
                    }
                    if (this.list[i].warehouseStockInfo.length === 0){
                        this.list.splice(i--, 1)
                    }
                    if (index !== -1) break
                }
                if (index !== -1) break
            }
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(this.$refs.table.$el.querySelectorAll('.el-table__body-wrapper .el-input__inner'))
                let index = inputNumberArr.findIndex(item => item === event.target)
                if (index === -1){
                    return
                }
                index = (++index) % inputNumberArr.length
                // console.log(index)
                inputNumberArr[index].focus()
                inputNumberArr[index].select()
            }
            return false
        }
    },
    created(){
        setTimeout(() => {
            this.getMaterialTree()
            this.getOutOrderInfo(() => {
                // 处理 checkedKeys 数组
                this.list.forEach(item => this.checkedKeys = this.checkedKeys.concat(item.warehouseStockInfo.map(val => val.id)))
                // 重置结构树的选中状态
                this.setCheckedKeys()
                // 设置 checkedKeys 的对比数组
                this.setContrasts()
            })
        }, 500)
    },
    mounted(){
        this.$refs.table.$el.addEventListener('keyup', this.keyUpHandle, false)
    },
    beforeDestroy(){
        this.$refs.table.$el.removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber
    }
}

// 树结构
// [
//     {
//         id: '原材料id-批号',
//         label: '原材料名称(批号)',
//         search_text: '原材料名称-拼音头',
//         children: [{
//             id: '原材料id-批号',
//             tid: '', // table 中用的，分类树给空串就行
//             label: '原材料名称(批号)',
//             search_text: '原材料名称-批号-拼音头', // 搜索条件
//             material_id: '原材料id',
//             name: '原材料名称',
//             code: '编号',
//             attribute_2_text: '规格',
//             unit_text: '单位',
//             want_num: '订货数量',
//             security_stock: '安存数量',
//             batch_code: '批号',
//             send_number: '出货数量',
//             warehouseStockNumber: '库存数量',
//             isEdit: true // 三级树中加就行
//         }]
//     }
// ]

// table 数据结构
// [
//     {
//         id: '原材料id-批号',
//         tid: '有值', // table 中用的，分类树给空串就行
//         label: '原材料名称(批号)',
//         search_text: '原材料名称-批号-拼音头', // 搜索条件
//         material_id: '原材料id',
//         name: '原材料名称',
//         code: '编号',
//         attribute_2_text: '规格',
//         unit_text: '单位',
//         want_num: '订货数量',
//         security_stock: '安存数量',
//         batch_code: '批号',
//         send_number: '出货数量',
//         warehouseStockNumber: '库存数量',
//         isEdit: true, // 三级树中加就行
//         warehouseStockInfo: [
//             {
//                 id: '原材料id-批号',
//                 tid: '有值', // table 中用的，分类树给空串就行
//                 label: '原材料名称(批号)',
//                 search_text: '原材料名称-批号-拼音头', // 搜索条件
//                 material_id: '原材料id',
//                 name: '原材料名称',
//                 code: '编号',
//                 attribute_2_text: '规格',
//                 unit_text: '单位',
//                 want_num: '订货数量',
//                 security_stock: '安存数量',
//                 batch_code: '批号',
//                 send_number: '出货数量',
//                 warehouseStockNumber: '库存数量',
//                 isEdit: true // 三级树中加就行
//             },
//             {}
//         ]
//     }
// ]
</script>

<style>
.out-order-panel {
    padding: 20px;
    overflow: hidden;
}

.out-order-box {
    margin-left: 360px;
}

.out-order-table .split-column {
    padding-top: 0;
    padding-bottom: 0;
}
.out-order-table .split-column .cell {
    padding: 0;
    outline: none;
}
.out-order-table .split-column .cell > div {
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
    outline: none;
    max-width: 100%;
}
.out-order-table .split-column .cell > div:not(:last-child) {
    border-bottom: 1px solid #ebeef5;
}
.out-order-table .split-column-th .cell {
    padding-left: 10px;
}
</style>