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
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">修改</el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">删除</el-button>
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
            const _this = this
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/mgr/dept/deleteByid', {
                    params: {
                        id: _id
                    }
                }).then(function (response){
                    if (response.data.code == 1){
                        _this.removeItemById(_id)
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                })
            }).catch(() => {})
        },
        getDeptList(){
            const _this = this
            this.loading = !0
            this.$http.get('/mgr/dept/query', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.loading = !1
                _this.list = response.data
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getDeptList()
            }
        },
        searchHandle(){
            const _this = this
            if (this.searchVal == ''){
                return this.getDeptList()
            }
            this.$http.get('/mgr/dept/query', {
                params: {
                    name: _this.searchVal
                }
            })
            .then(function (response){
                _this.list = response.data
            })
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