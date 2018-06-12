<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addUnitHandle">新增单位</el-button>
        <!-- <el-input class="store-search fr" placeholder="请输入类别名称" prefix-icon="el-icon-search"
            v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input> -->
    </div>
    <div class="appManager-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="单位名称"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="250"></el-table-column>
            <el-table-column prop="modify_time" label="最后修改时间" width="250"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <!-- <el-table-column type="selection" width="50"></el-table-column> -->
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="sortUnitHandle(list, '0')" type="text">
                        <i class="el-icon-sort"></i> 排序
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
    <ExtractPanel :params="addUnitExtract">
        <span slot="title">新增单位类别</span>
        <AddUnitPanel slot="panel" :params="addUnitExtract" @reloadEvent="reloadGetData"></AddUnitPanel>
    </ExtractPanel>
    <ExtractPanel :params="modUnitExtract">
        <span slot="title">修改单位类别</span>
        <ModUnitPanel slot="panel" :params="modUnitExtract" @reloadEvent="reloadGetData"></ModUnitPanel>
    </ExtractPanel>
    <ExtractPanel :params="sortUnitExtract">
        <span slot="title">修改单位类别排序 - 拖拽排序</span>
        <DragTreeSort slot="panel" 
            :list="sort.list"
            :pid="sort.pid"
            :params="sortUnitExtract" 
            @updateSort="updateUnitSort">
        </DragTreeSort>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddUnitPanel from './AddUnitPanel.vue'
import ModUnitPanel from './ModUnitPanel.vue'
import DragTreeSort from './DragTreeSort.vue'

import {getUnitInfo, delUnitRecord, updateUnitSort} from 'api'

export default {
    name: 'UnitManager',
    data(){
        return {
            list: [],
            cloneList: [],
            curPageIndex: 1, // 当前页码
            sort: {
                pid: '',
                list: []
            },
            search: {
                searchVal: ''
            },
            loading: false,
            addUnitExtract: {
                isPlay: false
            },
            modUnitExtract: {
                isPlay: false
            },
            sortUnitExtract: {
                isPlay: false
            }
        }
    },
    watch: {
        sortUnitExtract: {
            handler(newVal, oldVal){
                if (newVal.isPlay){
                    // 深拷贝数据
                    this.cloneList = _.cloneDeep(this.list)
                } else {
                    if (newVal.recovery){ // 需要恢复数据
                        this.resetList()
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        addUnitHandle(){
            this.addUnitExtract.isPlay = !0
        },
        sortUnitHandle(arr, pid){
            this.sort.pid = pid
            this.sort.list = arr
            this.sortUnitExtract.isPlay = !0
            this.sortUnitExtract.recovery = !0
        },
        modItemHandle(_id){
            this.modUnitExtract.isPlay = !0
            this.modUnitExtract.itemId = _id
        },
        delItemHandle(_id){
            this.$confirm('确认删除此单位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delUnitRecord({id: _id})
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
        async getUnitList(curPage, callback){
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            try {
                const response = await getUnitInfo({
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
        async updateUnitSort(res, callback){
            try {
                const response = await updateUnitSort({
                    pid: res.pid,
                    sort: res.sort
                })
                if (response.data.code == 1){
                    // 更新陈功，不需要恢复数据
                    this.sortUnitExtract.recovery = false
                    this.$message({
                        type: 'success',
                        message: '排序成功!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
                callback && callback()
            } catch (err){
                console.error(err)
            }
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getUnitList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getUnitList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getUnitList(1)
        },
        resetList(){
            this.cloneList.forEach((item, i) => this.list.splice(i, 1, item))
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
        this.getUnitList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        AddUnitPanel,
        ModUnitPanel,
        DragTreeSort
    }
}
</script>

<style>
.store-search {
    width: 300px;
}
</style>