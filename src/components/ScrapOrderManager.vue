<template>
<div class="appManager-wrapper">
    <section class="goods-tree-box">
        <el-input
            placeholder="输入商品编号/名称/拼音头" 
            prefix-icon="el-icon-search" 
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree" 
            ref="tree" 
            show-checkbox 
            :data="list" 
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check="checkChangeHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="dayOrder-list-box">
        <div class="appManager-top">
            <el-button class="fl" @click.stop="removeItemHandle">批量移除</el-button>
            <ul class="fr">
                <el-button class="fl" type="primary" :loading="btnLoading" @click.stop="nextStepHandle">下一步</el-button>
            </ul>
        </div>
        <div class="appManager-list fixedTable-list">
            <el-table
                class="goods-table"
                :data="tableList" 
                border 
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed></el-table-column>
                <el-table-column prop="name" label="商品名称" sortable></el-table-column>
                <el-table-column prop="code" label="商品编码" width="100"></el-table-column>
                <el-table-column prop="attribute_2_text" label="商品规格" width="100"></el-table-column>
                <el-table-column prop="unit_text" label="单位" width="100"></el-table-column>
                <el-table-column label="数量" width="140">
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

import { mapActions } from 'vuex'

import { recursionTree } from 'assets/js/tools'
import { getGoodsTree, createScrapMaterialOrder } from 'api'

export default {
    name: 'ScrapOrderManager',
    data(){
        return {
            list: [], // 商品分类树数组
            tableList: [], // 同步 商品分类树数组
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            multipleSelection: [], // 选中记录的数组
            btnLoading: false
        }
    },
    watch: {
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
            return data.search_text.indexOf(value) !== -1
        },
        async getGoodsTree(){
            try {
                const response = await getGoodsTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.tree
                }
            } catch (error){
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
                    return this.$message.warning('请勾选商品名称！')
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
        async nextStepHandle(){
            try {
                const _list = this.tableList.map(item => ({id: item.id, number: item.number}))
                if (_list.length == 0){
                    return this.$message.warning('请先编辑商品后再提交！')
                }
                this.btnLoading = !0
                const response = await createScrapMaterialOrder({
                    list: _list
                })
                if (response.data.code == 1 && typeof response.data.id != 'undefined'){
                    this.setLeaveRemind(!1)
                    this.$router.push({ path: `/storer_manager/scrap_material_order/${response.data.id}` })
                    setTimeout(() => {this.btnLoading = !1}, 500)
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
                const inputNumberArr = Array.from(document.querySelectorAll('.goods-table > .el-table__body-wrapper .el-input__inner'))
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
        this.getGoodsTree()
    },
    mounted(){
        document.querySelector('.goods-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.goods-table').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber
    }
}
</script>

<style>
.dayOrder-list-box {
    margin-left: 320px;
}
</style>