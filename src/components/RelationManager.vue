<template>
<div class="appManager-wrapper">
    <section class="gdmaRelat-tree-box">
        <el-input
            placeholder="输入商品编号/名称" 
            prefix-icon="el-icon-search" 
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree" 
            ref="tree" 
            show-checkbox 
            :data="data" 
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check-change="checkChangeHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="gdmaRelat-list-box">
        <div class="appManager-top gdmaRelat-top">
            <ul class="fr">
                <el-select class="fl" v-model="search.inventoryId" clearable @change="searchHandle" placeholder="请选择库存类型">
                    <el-option
                        v-for="(item, key) in inventoryList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select class="fl" v-model="search.formulaStateId" clearable @change="searchHandle" placeholder="请选择配方状态">
                    <el-option
                        v-for="(item, key) in formulaList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select class="fl gdstate" v-model="search.stateId" clearable @change="searchHandle" placeholder="启用">
                    <el-option
                        v-for="(item, key) in GdStateList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input class="fl" placeholder="请输入商品编号/名称" prefix-icon="el-icon-search"
                    v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
                </el-input>
            </ul>
        </div>
        <div class="appManager-list fixedTable-list">
            <el-table 
                :data="list" 
                border 
                v-loading="loading">
                <el-table-column prop="name" label="商品名称" width="220" sortable fixed></el-table-column>
                <el-table-column prop="type_2_text" label="商品中类" width="120"></el-table-column>
                <el-table-column prop="code" label="商品编号" width="120" sortable></el-table-column>
                <el-table-column prop="wm_type_text" label="库存类型" width="120"></el-table-column>
                <el-table-column prop="goods_unit_text" label="单位(标准)" width="100"></el-table-column>
                <el-table-column prop="bom_time_text" label="设定日期" width="180" sortable></el-table-column>
                <el-table-column label="配方状态" min-width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium" :type="scope.row.bom_status == '1' ? '' : 'danger'">
                            {{ scope.row.bom_status_text }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click.stop="editRelationHandle(scope.row.id, scope.row.name)" type="text">
                            <i class="el-icon-edit"></i> 编辑配方
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next, jumper"
                :total="list.total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
    <ExtractPanel :params="editRelationExtract" width="calc(100% - 200px)">
        <span slot="title">{{ editRelationExtract.promptTitle }}</span>
        <EditRelationPanel slot="panel" :params="editRelationExtract" @reloadEvent="reloadGetData"></EditRelationPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import EditRelationPanel from './EditRelationPanel.vue'

import {getGoodsList, getGdToryList, getFormulaList, getGoodsTypeTree} from 'api'

export default {
    name: 'RelationManager',
    data(){
        return {
            data: [], // 商品分类树数组
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            list: [{}], // 商品列表数组
            curPageIndex: 1, // 当前页码
            loading: false,
            inventoryList: [], // 库存类型数组
            formulaList: [], // 配方状态数组
            GdStateList: [], // 启用/停用状态数组
            search: {
                inventoryId: '', // 库存ID
                formulaStateId: '', // 配方状态ID
                stateId: '1', // 启停用状态ID
                searchVal: ''
            },
            editRelationExtract: {
                promptTitle: '商品配方',
                isPlay: false
            }
        }
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val)
        },
        checkedKeys(newVal, oldVal){
            if (newVal.join() !== oldVal.join()){
                this.getGoodsList(1)
            }
        }
    },
    methods: {
        checkChangeHandle(){
            this.getCheckedKeys()
        },
        getCheckedKeys(){
            // 重置选中树的ID数组
            this.checkedKeys = this.$refs.tree.getCheckedNodes().filter(item => item.parent_id != 0).map(item => item.id)
        },
        filterNode(value, data){
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        editRelationHandle(_id, _name){
            this.editRelationExtract.isPlay = !0
            this.editRelationExtract.itemId = _id
            this.editRelationExtract.promptTitle = _name + '配方'
        },
        async getInventoryList(){
            try {
                const response = await getGdToryList({type: 'query'})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.inventoryList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getFormulaList(){
            try {
                const response = await getFormulaList()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.formulaList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getGoodsTypeTree(){
            try {
                const response = await getGoodsTypeTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.data = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        getGoodsState(){
            this.GdStateList = [
                {id: '1', name: '启用'},
                {id: '0', name: '停用'}
            ]
        },
        async getGoodsList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getGoodsList({
                    pageNum: curPage,
                    pageSize: 10,
                    goodsTypeIds: this.checkedKeys.join(','),
                    inventoryId: this.search.inventoryId,
                    bomStatus: this.search.formulaStateId,
                    stateId: this.search.stateId,
                    keyword: this.search.searchVal
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.data.list
                    this.list.total = response.data.data.totalRow
                } else {
                    this.list.total = 0
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getGoodsList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getGoodsList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getGoodsList(1)
        }
    },
    created(){
        this.getGoodsTypeTree()
        this.getInventoryList()
        this.getFormulaList()
        this.getGoodsState()
        this.getGoodsList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        EditRelationPanel
    }
}
</script>

<style>
/* 商品分类结构树 */
.gdmaRelat-tree-box {
    margin-top: 60px;
    width: 260px;
    padding: 20px;
    position: absolute;
    background-color: #fff;
    margin-bottom: 20px;
}
.gdmaRelat-tree-box .filter-tree {
    margin-top: 10px;
}


.gdmaRelat-list-box {
    margin-left: 320px;
}
.gdmaRelat-top ul > .el-input {
    width: 220px;
}
.gdmaRelat-top ul > .el-select {
    width: 160px;
    margin-right: 10px;
}
.gdmaRelat-top ul > .el-select.gdstate {
    width: 120px;
}
</style>