<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addDepotHandle">新增仓库</el-button>
        <el-input 
            class="fr" 
            style="width: 240px" 
            placeholder="请输入仓库名称" 
            prefix-icon="el-icon-search"
            v-model="search.searchVal" 
            clearable
            @keyup.enter.native="searchHandle">
        </el-input>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="仓库名称" sortable></el-table-column>
            <el-table-column prop="code" label="仓库编码"></el-table-column>
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
    </div>
    <ExtractPanel :params="addDepotExtract">
        <span slot="title">新增仓库</span>
        <AddDepotPanel slot="panel" :params="addDepotExtract" @reloadEvent="reloadGetData"></AddDepotPanel>
    </ExtractPanel>
    <ExtractPanel :params="modDepotExtract">
        <span slot="title">修改仓库信息</span>
        <ModDepotPanel slot="panel" :params="modDepotExtract" @reloadEvent="reloadGetData"></ModDepotPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddDepotPanel from './AddDepotPanel.vue'
import ModDepotPanel from './ModDepotPanel.vue'

import { getDepotInfo, stopDepotRecord, delDepotRecord } from 'api'

export default {
    name: 'DepotManager',
    data(){
        return {
            list: [],
            search: {
                searchVal: ''
            },
            loading: false,
            addDepotExtract: {
                isPlay: false
            },
            modDepotExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addDepotHandle(){
            this.addDepotExtract.isPlay = !0
        },
        modItemHandle(_id){
            this.modDepotExtract.isPlay = !0
            this.modDepotExtract.itemId = _id
        },
        stopItemHandle(item){
            this.$confirm(`确认${item.status == '1' ? '停用' : '启用'}此仓库吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    let statusCode = item.status == '1' ? '0' : '1' // 1 -> 启用    0 -> 停用
                    const response = await stopDepotRecord({
                        id: item.id,
                        status: statusCode
                    })
                    if (response.data.code == 1){
                        item.status = statusCode
                        this.$message.success('操作成功!')
                    } else {
                        this.$message.error(response.data.message)
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        delItemHandle(_id){
            this.$confirm(`确认删除此仓库吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delDepotRecord({id: _id})
                    if (response.data.code == 1){
                        this.removeItemById(_id)
                        this.$message.success('操作成功!')
                    } else {
                        this.$message.error(response.data.message)
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        async getDepotList(callback){
            this.loading = !0
            try {
                const response = await getDepotInfo({
                    keyword: this.search.searchVal
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getDepotList()
            }
        },
        searchHandle(){
            this.getDepotList()
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
        this.getDepotList()
    },
    components: {
        ExtractPanel,
        AddDepotPanel,
        ModDepotPanel
    }
}
</script>

<style>
</style>