<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addStuffTypeHandle">新增原材料类别</el-button>
        <el-input class="stuffType-search fr" placeholder="请输入类别名称" prefix-icon="el-icon-search"
            v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <div class="tree-show-line" v-loading="loading">
            <ul class="">
                <li v-for="(item, index) in list" :key="index">
                    <div class="tree-item">
                        <span @click="childTreeHandle(item)">
                            <i class="tree-item-icon" 
                                :class="{'el-icon-minus': item.showChild, 'el-icon-plus': !item.showChild}">
                            </i>
                        </span>
                        <span style="width: 320px">{{ item.name }}</span>
                        <span style="flex: 1">{{ item.desc }}</span>
                        <span style="width: 220px">
                            <a href="javascript:;" @click.stop="modItemHandle(item.id)"><i class="el-icon-edit"></i> 编辑</a>
                            <a href="javascript:;" @click.stop="sortStuffTypeHandle(list, item.parent_id)"><i class="el-icon-sort"></i> 排序</a>
                            <a href="javascript:;" @click.stop="delItemHandle(item.id)"><i class="el-icon-delete"></i> 删除</a>
                        </span>
                    </div>
                    <el-collapse-transition>
                    <ul class="child-tree" v-show="item.showChild">
                        <li v-for="(val, key) in item.children" :key="key">
                            <div class="tree-item">
                                <span><i class="el-icon-document"></i></span>
                                <span style="width: 300px">{{ val.name }}</span>
                                <span style="flex: 1">{{ val.desc }}</span>
                                <span style="width: 220px">
                                    <a href="javascript:;" @click.stop="modItemHandle(val.id)"><i class="el-icon-edit"></i> 编辑</a>
                                    <a href="javascript:;" @click.stop="sortStuffTypeHandle(item.children, val.parent_id)"><i class="el-icon-sort"></i> 排序</a>
                                    <a href="javascript:;" @click.stop="delItemHandle(val.id)"><i class="el-icon-delete"></i> 删除</a>
                                </span>
                            </div>
                        </li>
                    </ul>
                    </el-collapse-transition>
                </li>
            </ul>
            <dl class="tree-norecord" v-if="list.noRecord">暂无数据...</dl>
        </div>
    </div>
    <ExtractPanel :params="addStuffTypeExtract">
        <span slot="title">新增原材料类别</span>
        <AddStuffTypePanel slot="panel" :params="addStuffTypeExtract" @reloadEvent="reloadGetData"></AddStuffTypePanel>
    </ExtractPanel>
    <ExtractPanel :params="modStuffTypeExtract">
        <span slot="title">修改原材料类别</span>
        <ModStuffTypePanel slot="panel" :params="modStuffTypeExtract" @reloadEvent="reloadGetData"></ModStuffTypePanel>
    </ExtractPanel>
    <ExtractPanel :params="sortStuffTypeExtract">
        <span slot="title">修改原材料类别排序 - 拖拽排序</span>
        <DragTreeSort slot="panel" 
            :list="sort.list"
            :pid="sort.pid"
            :params="sortStuffTypeExtract" 
            @updateSort="updateStuffTypeSort">
        </DragTreeSort>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddStuffTypePanel from './AddStuffTypePanel.vue'
import ModStuffTypePanel from './ModStuffTypePanel.vue'
import DragTreeSort from './DragTreeSort.vue'

import {getStuffTypeInfo, delStuffTypeRecord, updateStuffTypeSort} from 'api'

export default {
    name: 'StuffTypeTypeManager',
    data(){
        return {
            list: [],
            cloneList: [],
            sort: {
                pid: '',
                list: []
            },
            search: {
                searchVal: ''
            },
            loading: false,
            addStuffTypeExtract: {
                isPlay: false
            },
            modStuffTypeExtract: {
                isPlay: false
            },
            sortStuffTypeExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addStuffTypeHandle(){
            this.addStuffTypeExtract.isPlay = !0
        },
        sortStuffTypeHandle(arr, pid){
            this.sort.pid = pid
            this.sort.list = arr
            this.sortStuffTypeExtract.isPlay = !0
            this.sortStuffTypeExtract.recovery = !0
        },
        modItemHandle(_id){
            this.modStuffTypeExtract.isPlay = !0
            this.modStuffTypeExtract.itemId = _id
        },
        delItemHandle(_id){
            this.$confirm('确认删除此分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delStuffTypeRecord({id: _id})
                    if (response.data.code == 1){
                        this.getStuffTypeList()
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
        async getStuffTypeList(callback){
            this.loading = !0
            try {
                const response = await getStuffTypeInfo({
                    keyword: this.search.searchVal
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.data
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
            // 是否显示暂无数据
            this.list.noRecord = !this.list.length
        },
        async updateStuffTypeSort(res, callback){
            try {
                const response = await updateStuffTypeSort({
                    pid: res.pid,
                    sort: res.sort
                })
                if (response.data.code == 1){
                    // 更新陈功，不需要恢复数据
                    this.sortStuffTypeExtract.recovery = false
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
        reloadGetData(res){
            if (res == 'reload'){
                this.getStuffTypeList()
            }
        },
        searchHandle(){
            this.getStuffTypeList()
        },
        childTreeHandle(item){
            item.showChild = !item.showChild
        },
        resetList(){
            this.cloneList.forEach((item, i) => this.list.splice(i, 1, item))
        }
    },
    watch: {
        sortStuffTypeExtract: {
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
    created(){
        this.getStuffTypeList()
    },
    components: {
        ExtractPanel,
        AddStuffTypePanel,
        ModStuffTypePanel,
        DragTreeSort
    }
}
</script>

<style>
.stuffType-search {
    width: 300px;
}
</style>