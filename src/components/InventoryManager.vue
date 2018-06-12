<template>
<div class="appManager-wrapper">
    <section class="material-tree-box">
        <el-input
            placeholder="输入原材料编号/名称/拼音头" 
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
            @check="checkHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="order-list-box">
        <div class="appManager-top">
            <el-button class="fl" @click.stop="removeItemHandle">批量移除</el-button>
            <ul class="fr">
                <strong class="promptText fl">盘点日期：</strong>
                <el-date-picker
                    class="fl"
                    style="margin-right: 10px;"
                    v-model="inveDate"
                    type="date"
                    placeholder="盘点日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button class="fl" type="primary" :loading="btnLoading" @click.stop="saveInventoryHandle">保存</el-button>
            </ul>
        </div>
        <div class="appManager-list">
            <el-table
                class="inventory-table"
                :data="pagination.list" 
                border 
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed></el-table-column>
                <el-table-column prop="name" label="原材料名称" min-width="200" sortable></el-table-column>
                <el-table-column prop="code" label="原材料编码" width="100"></el-table-column>
                <el-table-column prop="unit_text" label="单位" width="80"></el-table-column>
                <el-table-column prop="attribute_2" label="规格" width="100"></el-table-column>
                <el-table-column prop="stock" label="历史库存" width="80"></el-table-column>
                <el-table-column label="库存数量" width="140">
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
            <el-pagination 
                background 
                layout="prev, pager, next, jumper"
                :total="pagination.total" 
                :page-size="pagination.size" 
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import EditNumber from './EditNumber.vue'

import { mapActions, mapState } from 'vuex'

import { recursionTree } from 'assets/js/tools'
import { getMaterialInventoryTree, saveInventoryMaterial } from 'api'

export default {
    name: 'InventoryManager',
    data(){
        return {
            inveDate: moment().format('YYYY-MM-DD'), // 盘点日期
            list: [], // 原材料分类树数组
            tableList: [], // 原材料数组
            pagination: {
                list: [], // table 分页数组
                number: 1, // 当前页码
                size: 20,  // 显示数量
                total: 0   // 总记录数
            },
            treeLoading: false,
            loading: false,
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            multipleSelection: [] // 选中记录的数组
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    watch: {
        ...mapActions(['setLeaveRemind']),
        filterText(val){
            this.$refs.tree.filter(val)
        },
        tableList(newVal, oldval){
            if (newVal.length){ // 数据有变化
                this.setLeaveRemind(!0)
            } else {
                this.setLeaveRemind(!1)
            }
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
        checkHandle(data, check){
            // if (!data.isEdit) return
            this.getCheckedKeys()
            this.asyncTableList()
            this.excuPagination()
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
            return data.search_text.indexOf(value) !== -1
        },
        excuPagination(){
            this.pagination.total = this.tableList.length
            let begin = (this.pagination.number - 1) * this.pagination.size
            let end   = begin + this.pagination.size
            this.pagination.list = this.tableList.slice(begin, end)
        },
        handleCurrentChange(index){
            this.pagination.number = index
            this.excuPagination()
        },
        async getMaterialsTree(callback){
            try {
                this.treeLoading = !0
                const response = await getMaterialInventoryTree({ date: this.inveDate })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.tree
                    callback && callback()
                }
            } catch (error){
                console.error(error)
            }
            this.treeLoading = !1
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
            // 处理分页
            this.excuPagination()
            // 重置树的选中状态
            this.setCheckedKeys()
        },
        async saveInventoryHandle(){
            try {
                const response = await saveInventoryMaterial({
                    date: this.inveDate,
                    list: this.tableList.map(item => ({
                        id: item.id,
                        number: item.number
                    }))
                })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    this.setLeaveRemind(!1)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (err){
                console.error(err)
            }
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.inventory-table > .el-table__body-wrapper .el-input__inner'))
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
        this.getMaterialsTree()
    },
    mounted(){
        document.querySelector('.inventory-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.inventory-table').removeEventListener('keyup', this.keyUpHandle)
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