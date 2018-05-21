<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addDeptHandle">新增部门</el-button>
        <el-input class="dept-search fr" placeholder="请输入部门名称" prefix-icon="el-icon-search"
            v-model="searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <el-table-column prop="parent_name" label="上级部门"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="addDeptExtract">
        <span slot="title">新增部门</span>
        <AddDeptPanel slot="panel" :params="addDeptExtract" @reloadEvent="reloadGetData"></AddDeptPanel>
    </ExtractPanel>
    <ExtractPanel :params="modDeptExtract">
        <span slot="title">修改部门信息</span>
        <ModDeptPanel slot="panel" :params="modDeptExtract" @reloadEvent="reloadGetData"></ModDeptPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddDeptPanel from './AddDeptPanel.vue'
import ModDeptPanel from './ModDeptPanel.vue'

import {getDeptInfo, delDeptRecord, searchDeptInfo} from 'api'

export default {
    name: 'DeptManager',
    data(){
        return {
            list: [],
            searchVal: '',
            loading: false,
            addDeptExtract: {
                isPlay: false
            },
            modDeptExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addDeptHandle(){
            this.addDeptExtract.isPlay = true
        },
        modItemHandle(_id){
            this.modDeptExtract.isPlay = true
            this.modDeptExtract.itemId = _id
        },
        delItemHandle(_id){
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delDeptRecord({id: _id})
                    if (response.data.code == 1){
                        this.removeItemById(_id)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                } catch (err){
                    console.error(err)
                }
            }).catch(() => {})
        },
        async getDeptList(){
            this.loading = !0
            try {
                const response = await getDeptInfo()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data
                }
            } catch (err){
                console.error(err)
            }
            this.loading = !1
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getDeptList()
            }
        },
        async searchHandle(){
            if (this.searchVal == ''){
                return this.getDeptList()
            }
            try {
                const response = await searchDeptInfo({name: this.searchVal})
                this.list = response.data
            } catch (error){
                console.error(error)
            }
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
        this.getDeptList()
    },
    components: {
        ExtractPanel,
        AddDeptPanel,
        ModDeptPanel
    }
}
</script>

<style>
.dept-search {
    width: 260px;
}
</style>