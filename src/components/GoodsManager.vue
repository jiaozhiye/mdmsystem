<template>
<div class="appManager-wrapper">
    <div class="appManager-top goods-top">
        <el-button class="fl" @click.stop="addGoodsHandle">新增商品</el-button>
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
            <el-select class="fl" v-model="search.gdtypeId" clearable @change="searchHandle" placeholder="请选择商品分类">
                <el-option
                    v-for="(item, key) in gdtypeList"
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
    <div class="appManager-list">
        <el-table 
            :data="list" 
            border 
            v-loading="loading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="商品名称" sortable></el-table-column>
            <el-table-column prop="type_2_text" label="商品中类"></el-table-column>
            <el-table-column prop="code" label="商品编号" sortable></el-table-column>
            <el-table-column prop="wm_type_text" label="库存类型"></el-table-column>
            <el-table-column prop="goods_unit_text" label="单位(标准)"></el-table-column>
            <el-table-column prop="price" label="定价" sortable></el-table-column>
            <el-table-column prop="sort" label="排序" sortable></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.status == '1' ? '' : 'danger'">
                        {{ scope.row.status == '1' ? '启用' : '停用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
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
    <ExtractPanel :params="addGoodsExtract">
        <span slot="title">新增商品</span>
        <AddGoodsPanel slot="panel" :params="addGoodsExtract" @reloadEvent="reloadGetData"></AddGoodsPanel>
    </ExtractPanel>
    <ExtractPanel :params="modGoodsExtract">
        <span slot="title">修改商品信息</span>
        <ModGoodsPanel slot="panel" :params="modGoodsExtract" @reloadEvent="reloadGetData"></ModGoodsPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddGoodsPanel from './AddGoodsPanel.vue'
import ModGoodsPanel from './ModGoodsPanel.vue'

import {getGdtypeTree, getGoodsInfo, delGoodsRecord, batchDelGoodsRecord} from 'api'

export default {
    name: 'GoodsManager',
    data(){
        return {
            list: [],
            curPageIndex: 1, // 当前页码
            gdtypeList: [],
            multipleSelection: [], // 选中记录的数组
            search: {
                gdtypeId: '',
                searchVal: ''
            },
            loading: false,
            addGoodsExtract: {
                isPlay: false
            },
            modGoodsExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addGoodsHandle(){
            this.addGoodsExtract.isPlay = !0
        },
        modItemHandle(_id){
            this.modGoodsExtract.isPlay = !0
            this.modGoodsExtract.itemId = _id
        },
        async getGdtypeList(){
            try {
                const response = await getGdtypeTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.gdtypeList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        delItemHandle(item){
            this.$confirm(`确认${item.status == '1' ? '停用' : '启用'}此商品吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delGoodsRecord({
                        id: item.id,
                        state: item.status == '1' ? '0' : '1' // 1 -> 启用    0 -> 停用
                    })
                    if (response.data.code == 1){
                        // this.removeItemById(_id)
                        this.getGoodsList(this.curPageIndex)
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
        async getGoodsList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getGoodsInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    keyword: this.search.searchVal,
                    type: this.search.gdtypeId
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
        },
        importHandle(){
            
        },
        exportHandle(){
            
        },
        batchDelHandle(){
            if (this.multipleSelection.length == 0){
                return this.$message({
                    type: 'warning',
                    message: '请勾选商品记录再进行批量删除!'
                })
            }
            this.$confirm(`确认要删除选中的${this.multipleSelection.length}条记录吗？删除后将不能恢复！`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await batchDelGoodsRecord({
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
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        }
    },
    created(){
        this.getGoodsList(this.curPageIndex)
        this.getGdtypeList()
    },
    components: {
        ExtractPanel,
        AddGoodsPanel,
        ModGoodsPanel
    }
}
</script>

<style>
.goods-top .el-dropdown {
    margin-left: 10px;
}
.goods-top ul {
    height: 40px;
}
.goods-top ul > .el-input {
    width: 280px;
}
.goods-top ul > .el-select {
    width: 200px;
    margin-right: 10px;
}
</style>