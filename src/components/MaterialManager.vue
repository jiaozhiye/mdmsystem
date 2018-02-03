<template>
<div class="appManager-wrapper material-wrapper">
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
            :data="data" 
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check-change="checkChangeHandle" 
            :filter-node-method="filterNode" 
            :render-content="renderContent">
        </el-tree>
    </section>
    <div class="material-list-box">
        <div class="appManager-top material-top">
            <el-button class="fl" @click.stop="addMaterialHandle()">新增原材料</el-button>
            <el-dropdown class="fl" placement="top-start" trigger="click">
                <el-button>
                    操 作 <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.stop.native="importHandle">导入操作</el-dropdown-item>
                    <el-dropdown-item @click.stop.native="exportHandle">导出操作</el-dropdown-item>
                    <el-dropdown-item @click.stop.native="batchDelHandle">批量删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <ul class="fr">
                <el-select class="fl" v-model="search.inventoryId" clearable @change="searchHandle" placeholder="请选择库存类型">
                    <el-option
                        v-for="(item, key) in inventoryList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input class="fl" placeholder="请输入原材料编号/名称" prefix-icon="el-icon-search"
                    v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
                </el-input>
            </ul>
        </div>
        <div class="appManager-list fixedTable-list">
            <el-table 
                :data="list" 
                border 
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed></el-table-column>
                <el-table-column prop="name" label="原材料名称" width="250" sortable></el-table-column>
                <el-table-column prop="type_2_text" label="原材料中类" width="150"></el-table-column>
                <el-table-column prop="code" label="原材料编号" width="150" sortable></el-table-column>
                <el-table-column prop="wm_type_text" label="库存类型" width="150"></el-table-column>
                <el-table-column prop="goods_unit_text" label="单位(标准)" width="100"></el-table-column>
                <el-table-column prop="purchase_price" label="采购价(成本价)" width="150" sortable></el-table-column>
                <el-table-column prop="balance_price" label="默认结算价" width="130" sortable></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="medium" :type="scope.row.status == '1' ? '' : 'danger'">
                            {{ scope.row.status == '1' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                            <i class="el-icon-edit"></i> 修改
                        </el-button>
                        <el-button @click.stop="delItemHandle(scope.row)" type="text">
                            <i class="el-icon-delete"></i> {{ scope.row.status == '1' ? '停用' : '启用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next, jumper"
                :total="list.total" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
    <ExtractPanel :params="addMaterialExtract">
        <span slot="title">新增原材料</span>
        <AddMaterialPanel slot="panel" :classid="stuffIdForAdd" :params="addMaterialExtract" @reloadEvent="reloadGetData"></AddMaterialPanel>
    </ExtractPanel>
    <ExtractPanel :params="modMaterialExtract">
        <span slot="title">修改原材料信息</span>
        <ModMaterialPanel slot="panel" :params="modMaterialExtract" @reloadEvent="reloadGetData"></ModMaterialPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddMaterialPanel from './AddMaterialPanel.vue'
import ModMaterialPanel from './ModMaterialPanel.vue'

import {getMaterialInfo, getStuffToryList, delMaterialRecord, getMaterialTree, batchDelMaterialRecord} from 'api'

export default {
    name: 'MaterialManager',
    data(){
        return {
            data: [], // 原材料分类树数组
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            list: [], // 原材料列表数组
            multipleSelection: [], // 选中记录的数组
            curPageIndex: 1, // 当前页码
            loading: false,
            inventoryList: [], // 库存类型数组
            search: {
                inventoryId: '', // 库存ID
                searchVal: ''
            },
            stuffIdForAdd: '', // 通过分类树添加原材料
            addMaterialExtract: {
                isPlay: false
            },
            modMaterialExtract: {
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
                this.getMaterialList(1)
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
            // console.log(this.checkedKeys)
        },
        filterNode(value, data){
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        addMaterialHandle(_id){
            // console.log(_id)
            this.addMaterialExtract.isPlay = !0
            if (typeof _id != 'undefined' && typeof _id != 'object'){
                this.stuffIdForAdd = _id.toString()
            } else {
                this.stuffIdForAdd = ''
            }
        },
        modItemHandle(_id){
            this.modMaterialExtract.isPlay = !0
            this.modMaterialExtract.itemId = _id
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
        async getMaterialTree(){
            try {
                const response = await getMaterialTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.data = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getMaterialList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getMaterialInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    materialTypeIds: this.checkedKeys.join(','),
                    inventoryId: this.search.inventoryId,
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
            this.getMaterialList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getMaterialList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getMaterialList(1)
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        importHandle(){
            
        },
        exportHandle(){
            
        },
        delItemHandle(item){
            this.$confirm(`确认${item.status == '1' ? '停用' : '启用'}此原材料吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delMaterialRecord({
                        id: item.id,
                        state: item.status == '1' ? '0' : '1' // 1 -> 启用    0 -> 停用
                    })
                    if (response.data.code == 1){
                        // this.removeItemById(_id)
                        this.getMaterialList(this.curPageIndex)
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        batchDelHandle(){
            if (this.multipleSelection.length == 0){
                return this.$message({
                    type: 'warning',
                    message: '请勾选原材料记录再进行批量删除!'
                })
            }
            this.$confirm(`确认要删除选中的${this.multipleSelection.length}条记录吗？删除后将不能恢复！`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await batchDelMaterialRecord({
                        ids: this.multipleSelection.map(item => item.id)
                    })
                    if (response.data.code == 1){
                        this.multipleSelection.forEach(item => this.removeItemById(item.id))
                        // 清空 multipleSelection
                        this.multipleSelection.splice(0)
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        },
        renderContent (h, { node, data, store }){
            if (data.parent_id != 0){
                return (
                    <span class="tree-item" style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
                        <span>{ node.label }</span>
                        <span class="tree-item-handle">
                            <el-dropdown>
                                <span class="tree-dropdown-link">操作</span>
                                <el-dropdown-menu slot="dropdown" class="tree-dropdown">
                                    <li class="el-dropdown-menu__item" 
                                        onClick={ (ev) => {ev.stopPropagation();this.addMaterialHandle(data.id)} }>
                                        新增原材料
                                    </li>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                    </span>
                )
            } else {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
                        <span>{ node.label }</span>
                    </span>
                )
            }
        },
        treeBindEvent(){
            let aTreeSpan = this.$el.getElementsByClassName('filter-tree')[0].getElementsByClassName('tree-item')
            for (let i = 0; i < aTreeSpan.length; i++){
                aTreeSpan[i].parentNode.addEventListener('mouseenter', (ev) => {
                    ev.stopPropagation()
                    ev.target.getElementsByClassName('tree-item-handle')[0].classList.add('show')
                }, false)
                aTreeSpan[i].parentNode.addEventListener('mouseleave', (ev) => {
                    ev.stopPropagation()
                    ev.target.getElementsByClassName('tree-item-handle')[0].classList.remove('show')
                }, false)
            }
        }
    },
    created(){
        this.getMaterialTree()
        this.getInventoryList()
        this.getMaterialList(this.curPageIndex)
    },
    mounted(){
        // this.treeBindEvent()
    },
    components: {
        ExtractPanel,
        AddMaterialPanel,
        ModMaterialPanel
    }
}
</script>

<style>
.material-wrapper {
    height: 100%;
}

/* 原材料分类树 */
.material-tree-box {
    width: 280px;
    padding: 20px;
    max-height: calc(100% - 80px);
    position: absolute;
    background-color: #fff;
    overflow-y: auto;
}
.material-tree-box .filter-tree {
    margin-top: 10px;
}
.material-tree-box .tree-item-handle {
    /* display: none; */
}
.material-tree-box .tree-item-handle.show {
    display: block;
}
.material-tree-box .tree-dropdown-link {
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
}
/* 重设 element-ui dropdown 组件列表样式 */
.tree-dropdown > li {
    font-size: 12px;
    line-height: 30px;
}



.material-list-box {
    margin-left: 340px;
}
.material-top .el-dropdown {
    margin-left: 10px;
}
.material-top ul > .el-input {
    width: 260px;
}
.material-top ul > .el-select {
    width: 180px;
    margin-right: 10px;
}
</style>