<template>
<div class="appManager-wrapper" style="padding: 20px;">
    <section class="material-tree-box">
        <el-input
            placeholder="输入原材料编号/名称" 
            prefix-icon="el-icon-search" 
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree" 
            ref="tree" 
            show-checkbox 
            :data="list" 
            node-key="id" 
            v-loading="treeLoading"
            default-expand-all 
            :expand-on-click-node="false" 
            @check="checkChangeHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="order-list-box">
        <div class="appManager-top">
            <el-button class="fl" @click.stop="removeItemHandle">批量移除</el-button>
            <ul class="fr">
                <el-button class="fl" type="primary" :loading="btnLoading" @click.stop="submitHandle">保存</el-button>
            </ul>
        </div>
        <div class="appManager-list fixedTable-list">
            <el-table
                class="material-table"
                :data="tableList" 
                border 
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed></el-table-column>
                <el-table-column prop="name" label="原材料名称" min-width="200"></el-table-column>
                <el-table-column prop="code" label="原材料编码" width="100"></el-table-column>
                <el-table-column prop="unit_text" label="单位" width="80"></el-table-column>
                <el-table-column label="退货数量" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.number"
                            :stepVal="1">
                        </EditNumber>
                    </template>
                </el-table-column>
                <el-table-column label="退货理由" width="240">
                    <template slot-scope="scope">
                        <el-input
                            type="textarea"
                            v-model="scope.row.remark"
                            :rows="2"
                            placeholder="退货理由...">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click.stop="removeItemHandle([scope.row.id])" type="text">
                            <i class="el-icon-delete"></i> 移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</div>
</template>

<script>
import EditNumber from './EditNumber.vue'

import { mapActions } from 'vuex'

import { recursionTree } from 'assets/js/tools'
import { getReturnOrderTree, getReturnOrderDetail, updateReturnOrder } from 'api'

export default {
    name: 'ModReturnOrderPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [], // 商品分类树数组
            tableList: [], // 同步 商品分类树数组
            referData: [], // 用于对比的数据
            treeLoading: false,
            loading: false,
            btnLoading: false,
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            multipleSelection: [] // 选中记录的数组
        }
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val)
        },
        tableList: {
            handler(newVal, oldVal){
                if (newVal.length !== this.referData.length){ // 数据改变了
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
        asyncTableList(){
            let _arr = []
            recursionTree(this.list, (item) => {
                if (this.checkedKeys.findIndex(val => val === item.id) !== -1){
                    _arr.push(item)
                }
            })
            this.tableList = _arr
        },
        checkChangeHandle(){
            this.getCheckedKeys()
            this.asyncTableList()
        },
        getCheckedKeys(){
            // 重置选中树的ID数组 - 过滤掉一级二级分类
            this.checkedKeys = this.$refs.tree.getCheckedKeys(true)
            // console.log(this.checkedKeys)
        },
        setCheckedKeys(){
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
        },
        filterNode(value, data){
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        async getReturnOrderTree(callback){
            try {
                this.treeLoading = !0
                const response = await getReturnOrderTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    // 原材料树新增 number 字段，默认值是 1
                    recursionTree(response.data.tree, item => {
                        item.number = 1
                        item.remark = ''
                    })
                    this.list = response.data.tree
                    callback && callback()
                }
            } catch (error){
                console.error(error)
            }
            this.treeLoading = !1
        },
        async getReturnOrderList(){
            this.loading = !0
            try {
                const response = await getReturnOrderDetail({
                    orderId: this.params.id
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.tableList = response.data.materialOrderList
                    // 把编辑过的原材料同步到左侧树
                    recursionTree(this.list, (item) => {
                        let obj = this.tableList.find(val => val.id === item.id)
                        if (typeof obj != 'undefined'){
                            for (let attr in obj){
                                item[attr] = obj[attr]
                            }
                        }
                        obj = null
                    })
                    this.checkedKeys = this.tableList.map(item => item.id)
                    this.setCheckedKeys()
                    
                    // 设置对比数据
                    this.referData = _.cloneDeep(this.tableList)
                }
                this.loading = !1
            } catch (error){
                this.loading = !1
                console.error(error)
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        removeItemHandle(ids){
            if (!Array.isArray(ids)){
                ids = this.multipleSelection.map(item => item.id)
                if (ids.length == 0){
                    return this.$message.warning('请勾选原材料名称！')
                }
            }
            // 处理 checkedKeys 数组
            for (let i = 0; i < this.checkedKeys.length; i++){
                if (ids.findIndex(val => val === this.checkedKeys[i]) !== -1){
                    this.checkedKeys.splice(i--, 1)
                }
            }
            // 删除 tableList 中的记录
            for (let i = 0; i < this.tableList.length; i++){
                if (ids.findIndex(val => val === this.tableList[i].id) !== -1){
                    this.tableList.splice(i--, 1)
                }
            }
            // 重置树的选中状态
            this.setCheckedKeys()
        },
        async updateOrderHandle(callback){
            try {
                this.btnLoading = !0
                const response = await updateReturnOrder({
                    orderId: this.params.id,
                    list: this.tableList.map(item => ({
                        id: item.id,
                        remark: item.remark,
                        number: item.number
                    }))
                })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
                this.btnLoading = !1
            } catch (err){
                console.error(err)
            }
        },
        submitHandle(){
            this.updateOrderHandle(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.setLeaveRemind(!1)
            this.params.isPlay = false
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.material-table > .el-table__body-wrapper .el-input__inner'))
                let index = inputNumberArr.findIndex(item => item === event.target)
                if (index === -1){
                    return
                }
                index = (++index) % inputNumberArr.length
                // console.log(index)
                inputNumberArr[index].focus()
            }
            return false
        }
    },
    created(){
        // 先获取原材料树
        this.getReturnOrderTree(() => { // 再获取已编辑商品原材料
            this.getReturnOrderList()
        })
    },
    mounted(){
        document.querySelector('.material-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.material-table').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber
    }
}
</script>

<style>
.order-list-box {
    margin-left: 360px;
}
</style>