<template>
<div class="appManager-wrapper">
    <div class="appManager-top employ-top">
        <el-button class="fl" @click.stop="addEmployHandle">新增员工</el-button>
        <ul class="fr">
            <el-select class="fl" v-model="search.jobId" clearable @change="searchHandle" placeholder="请选择职务">
                <el-option
                    v-for="(item, key) in jobList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select class="fl" v-model="search.deptId" clearable @change="searchHandle" placeholder="请选择部门">
                <el-option
                    v-for="(item, key) in deptList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-input class="fl" placeholder="名称/拼音头/手机" prefix-icon="el-icon-search"
                v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
            </el-input>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="员工名称" sortable></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="dept_name" label="部门" sortable></el-table-column>
            <el-table-column prop="job_name" label="职务" sortable></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 离职
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="addEmployExtract">
        <span slot="title">新增员工</span>
        <AddEmployPanel slot="panel" :params="addEmployExtract" @reloadEvent="reloadGetData"></AddEmployPanel>
    </ExtractPanel>
    <ExtractPanel :params="modEmployExtract">
        <span slot="title">修改员工信息</span>
        <ModEmployPanel slot="panel" :params="modEmployExtract" @reloadEvent="reloadGetData"></ModEmployPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddEmployPanel from './AddEmployPanel.vue'
import ModEmployPanel from './ModEmployPanel.vue'

import {getJobInfo, getDeptList, getEmployInfo, delEmployRecord} from 'api'

export default {
    name: 'EmployManager',
    data(){
        return {
            list: [],
            curPageIndex: 1, // 当前页码
            jobList: [],
            deptList: [],
            search: {
                jobId: '',
                deptId: '',
                searchVal: ''
            },
            loading: false,
            addEmployExtract: {
                isPlay: false
            },
            modEmployExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addEmployHandle(){
            this.addEmployExtract.isPlay = !0
        },
        modItemHandle(_id){
            this.modEmployExtract.isPlay = !0
            this.modEmployExtract.itemId = _id
        },
        async getJobList(){
            try {
                const response = await getJobInfo()
                this.jobList = response.data
            } catch (error){
                console.error(error)
            }
        },
        async getDeptList(){
            try {
                const response = await getDeptList()
                this.deptList = response.data
            } catch (error){
                console.error(error)
            }
        },
        delItemHandle(_id){
            this.$confirm('确认此员工离职吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delEmployRecord({id: _id})
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
        async getEmployList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getEmployInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    keyword: this.search.searchVal,
                    dept: this.search.deptId,
                    job: this.search.jobId
                })
                // console.log(response.data)
                this.list = response.data.list
                this.list.total = response.data.totalRow
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getEmployList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getEmployList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getEmployList(1)
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
        this.getEmployList(this.curPageIndex)
        this.getJobList()
        this.getDeptList()
    },
    components: {
        ExtractPanel,
        AddEmployPanel,
        ModEmployPanel
    }
}
</script>

<style>
.employ-top ul {
    height: 40px;
}
.employ-top ul > .el-input {
    width: 280px;
}
.employ-top ul > .el-select {
    width: 200px;
    margin-right: 10px;
}
</style>