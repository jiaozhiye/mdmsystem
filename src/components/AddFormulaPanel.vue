<template>
<div class="appManager-wrapper formula-wrapper">
    <div class="appManager-top formula-top">
        <el-select class="fl" v-model="search.inventoryId" 
            clearable 
            @change="searchHandle" 
            placeholder="请选择库存类型">
            <el-option
                v-for="(item, key) in inventoryList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select
            v-model="search.stufftypeId" 
            multiple 
            collapse-tags 
            class="fl" 
            clearable 
            @change="searchHandle" 
            placeholder="请选原材料分类">
            <el-option
                v-for="item in stufftypeList"  
                :key="item.value" 
                :label="item.name" 
                :value="item.id"
                :disabled="item.disabled">
            </el-option>
        </el-select>
        <el-input class="fl" placeholder="请输入原材料编号/名称" prefix-icon="el-icon-search"
            v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
        
    </div>
    <div class="appManager-list formulaTable">
        <el-table 
            ref="multipleTable" 
            :data="list" 
            border 
            v-loading="loading" 
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column prop="name" label="原材料名称" sortable></el-table-column>
            <el-table-column prop="goods_unit_text" label="单位(标准)" width="150"></el-table-column>
            <el-table-column prop="type_2_text" label="原材料中类" width="150" sortable></el-table-column>
            <el-table-column prop="code" label="原材料编号" width="150"></el-table-column>
            <el-table-column prop="wm_type_text" label="库存类型" width="150"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
import {getFormulaInfo, getMaterialSelTree, getStuffToryList} from 'api'

export default {
    name: 'AddFormulaPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [],
            curPageIndex: 1, // 当前页码
            loading: false,
            multipleSelection: [], // 选中记录的数组
            inventoryList: [], // 原材料库存类型数组
            stufftypeList: [], // 原材料分类数组
            search: {
                inventoryId: '', // 库存ID
                stufftypeId: '', // 原材料分类ID
                searchVal: ''
            }
        }
    },
    methods: {
        handleSelectionChange(val){
            this.multipleSelection = val
            // console.log(this.multipleSelection)
            this.$emit('reloadEvent', this.multipleSelection)
        },
        async getInventoryList(){
            try {
                const response = await getStuffToryList({type: 'query'})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.inventoryList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStufftypeList(){
            try {
                const response = await getMaterialSelTree({type: 1})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.stufftypeList = response.data.list
                    this.stufftypeList.forEach(item => {
                        if (item.parent_id === '0'){
                            item.disabled = true
                        }
                    })
                }
            } catch (error){
                console.error(error)
            }
        },
        async getFormulaList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getFormulaInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    materialTypeIds: this.search.stufftypeId,
                    inventoryId: this.search.inventoryId,
                    keyword: this.search.searchVal
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    response.data.data.list.map(item => item.isEdit = false)
                    this.list = response.data.data.list
                    this.list.total = response.data.data.totalRow
                    setTimeout(() => {
                        this.list.forEach(item => {
                            if (this.params.formulaIds.indexOf(item.id) != -1){
                                this.$refs.multipleTable.toggleRowSelection(item, true)
                            }
                        })
                    }, 0)
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
            this.getFormulaList(index)
        },
        searchHandle(){
            this.getFormulaList(1)
        }
    },
    created(){
        this.getInventoryList()
        this.getStufftypeList()
        this.getFormulaList(this.curPageIndex)
    }
}
</script>

<style>
.formula-wrapper {
    padding: 20px;
}
.formula-top > .el-select {
    min-width: 160px;
    margin-right: 10px;
}
.formula-top > .el-select:nth-of-type(2) {
    width: 260px;
}
.formula-top > .el-input {
    width: 200px;
}
.formula-wrapper .formulaTable .el-table__body td {
    padding: 12px 0;
}
</style>