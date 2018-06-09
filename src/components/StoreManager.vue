<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addStoreHandle">新增门店</el-button>
        <el-input class="store-search fr" placeholder="请输入门店名称" prefix-icon="el-icon-search"
            v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="门店名称" width="300" sortable>
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="门店地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="门店电话" width="150"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.status == '1' ? '' : 'danger'">
                        {{ scope.row.status_text }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="stopItemHandle(scope.row)" type="text">
                        <i :class="{'el-icon-circle-close-outline': scope.row.status == '1', 'el-icon-circle-check-outline': scope.row.status != '1'}"></i>
                        {{ scope.row.status == '1' ? '停用' : '启用' }}
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="addStoreExtract">
        <span slot="title">新增门店</span>
        <AddStorePanel slot="panel" :params="addStoreExtract" @reloadEvent="reloadGetData"></AddStorePanel>
    </ExtractPanel>
    <ExtractPanel :params="modStoreExtract">
        <span slot="title">修改门店信息</span>
        <ModStorePanel slot="panel" :params="modStoreExtract" @reloadEvent="reloadGetData"></ModStorePanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddStorePanel from './AddStorePanel.vue'
import ModStorePanel from './ModStorePanel.vue'

import {getStoreInfo, stopStoreRecord, delStoreRecord} from 'api'

export default {
    name: 'StoreManager',
    data(){
        return {
            list: [],
            curPageIndex: 1, // 当前页码
            search: {
                searchVal: ''
            },
            loading: false,
            addStoreExtract: {
                isPlay: false
            },
            modStoreExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addStoreHandle(){
            this.addStoreExtract.isPlay = !0
        },
        modItemHandle(_id){
            this.modStoreExtract.isPlay = !0
            this.modStoreExtract.itemId = _id
        },
        stopItemHandle(item){
            this.$confirm(`确认${item.status == '1' ? '停用' : '启用'}此门店吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await stopStoreRecord({
                        id: item.id,
                        status: item.status == '1' ? '0' : '1' // 1 -> 启用    0 -> 停用
                    })
                    if (response.data.code == 1){
                        // this.removeItemById(_id)
                        this.getStoreList(this.curPageIndex)
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
        delItemHandle(_id){
            this.$confirm(`确认删除此门店吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delStoreRecord({id: _id})
                    if (response.data.code == 1){
                        this.removeItemById(_id)
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
        async getStoreList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getStoreInfo({
                    pageNum: curPage,
                    pageSize: 10,
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
            this.getStoreList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getStoreList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getStoreList(1)
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
        this.getStoreList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        AddStorePanel,
        ModStorePanel
    }
}
</script>

<style>
.store-search {
    width: 300px;
}
</style>