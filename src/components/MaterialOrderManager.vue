<template>
<div class="appManager-wrapper">
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
            v-loading="treeLoading" 
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check-change="checkChangeHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="order-list-box">
        <div class="appManager-top">
            <el-button class="fl" @click.stop="removeItemHandle">批量移除</el-button>
            <ul class="fr">
                <strong class="promptText fl">要货日期：</strong>
                <el-date-picker
                    class="fl"
                    style="width: 200px; margin-right: 10px;"
                    v-model="form.wantDate"
                    type="date"
                    disabled
                    placeholder="要货日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <strong class="promptText fl">到货日期：</strong>
                <el-date-picker
                    class="fl"
                    style="width: 200px; margin-right: 10px;"
                    v-model="form.arriveDate"
                    type="date"
                    disabled
                    placeholder="到货日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-button class="fl" type="primary" :loading="btnLoading" @click.stop="saveOrderHandle">保存</el-button>
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
                <el-table-column prop="nextOneNum" label="明日预计数量" width="110"></el-table-column>
                <el-table-column prop="nextOneGetNum" label="明日到货数量" width="110"></el-table-column>
                <el-table-column prop="nextTwoNum" label="后天预计数量" width="110"></el-table-column>
                <el-table-column prop="nextTwoGetNum" label="后天到货数量" width="110"></el-table-column>
                <el-table-column prop="actual_order" label="预计订货数量" width="110"></el-table-column>
                <el-table-column prop="stock" label="库存数量" width="80"></el-table-column>
                <el-table-column label="需要订货数量" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.number"
                            :stepVal="1">
                        </EditNumber>
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

import { recursionTree } from 'common/js/tools'
import { getMaterialsTree, getEditedMaterial, saveEditedMaterial } from 'api'

export default {
    name: 'MaterialOrderManager',
    data(){
        return {
            form: {
                wantDate: '',
                arriveDate: ''
            },
            list: [], // 原材料分类树数组
            tableList: [], // 同步 原材料分类树数组
            loading: false,
            treeLoading: false,
            btnLoading: false,
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            multipleSelection: [], // 选中记录的数组
            pickerOptions: {
                disabledDate (time){
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
                }
            }
        }
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val)
        }
    },
    methods: {
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
            this.checkedKeys = this.$refs.tree.getCheckedNodes().filter(item => item.isEdit).map(item => item.id)
            // console.log(this.checkedKeys)
        },
        setCheckedKeys(){
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
        },
        filterNode(value, data){
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        async getMaterialsTree(callback){
            try {
                this.treeLoading = !0
                const response = await getMaterialsTree({ id: this.$route.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    // 原材料树新增 number 字段，默认值是 1
                    recursionTree(response.data.tree, item => item.number = 1)
                    this.list = response.data.tree
                    callback && callback()
                }
            } catch (error){
                console.error(error)
            }
            this.treeLoading = !1
        },
        async getEditedMaterial(){
            this.loading = !0
            try {
                const response = await getEditedMaterial({
                    id: this.$route.params.id
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.tableList = response.data.materialList
                    this.form.wantDate = response.data.wantDate
                    this.form.arriveDate = response.data.arriveDate

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
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
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
            this.setCheckedKeys()
        },
        async saveOrderHandle(){
            try {
                this.btnLoading = !0
                const response = await saveEditedMaterial({
                    list: this.tableList.map(item => ({
                        id: item.id,
                        stroe_order_material_id: item.stroe_order_material_id,
                        number: item.number
                    }))
                })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    // 跳转
                    this.$router.push('/storer_manager/store_order_list')
                } else {
                    this.$message.error(response.data.message)
                }
                this.btnLoading = !1
            } catch (err){
                console.error(err)
            }
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
        this.getMaterialsTree(() => { // 再获取已编辑商品原材料
            this.getEditedMaterial()
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