<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addGdtypeHandle">新增商品类别</el-button>
        <el-input class="gdtype-search fr" placeholder="请输入类别名称" prefix-icon="el-icon-search"
            v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <div class="tree-show-line" v-loading="loading">
            <dl class="tree-tb-top">
                <dd style="width: 448px">分类名称</dd>
                <dd style="flex: 1">分类编码</dd>
                <dd style="width: 304px">最后修改时间</dd>
                <dd style="width: 215px">操作</dd>
            </dl>
            <ul class="">
                <li v-for="(item, index) in list" :key="index">
                    <div class="tree-item">
                        <span @click="childTreeHandle(item)">
                            <i class="tree-item-icon" 
                                :class="{'el-icon-minus': item.showChild, 'el-icon-plus': !item.showChild}">
                            </i>
                        </span>
                        <span style="width: 420px">{{ item.name }}</span>
                        <span style="flex: 1">{{ item.code }}</span>
                        <span style="width: 300px">{{ item.modify_time }}</span>
                        <span style="width: 220px">
                            <a href="javascript:;" @click.stop="modItemHandle(item.id)"><i class="el-icon-edit"></i> 编辑</a>
                            <a href="javascript:;" @click.stop="sortGdtypeHandle(list, item.parent_id)"><i class="el-icon-sort"></i> 排序</a>
                            <a href="javascript:;" @click.stop="delItemHandle(item.id)"><i class="el-icon-delete"></i> 删除</a>
                        </span>
                    </div>
                    <el-collapse-transition>
                    <ul class="child-tree" v-show="item.showChild">
                        <li v-for="(val, key) in item.children" :key="key">
                            <div class="tree-item">
                                <span><i class="el-icon-document"></i></span>
                                <span style="width: 400px">{{ val.name }}</span>
                                <span style="flex: 1">{{ val.code }}</span>
                                <span style="width: 300px">{{ item.modify_time }}</span>
                                <span style="width: 220px">
                                    <a href="javascript:;" @click.stop="modItemHandle(val.id)"><i class="el-icon-edit"></i> 编辑</a>
                                    <a href="javascript:;" @click.stop="sortGdtypeHandle(item.children, val.parent_id)"><i class="el-icon-sort"></i> 排序</a>
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
    <ExtractPanel :params="addGdtypeExtract">
        <span slot="title">新增商品类别</span>
        <AddGoodsTypePanel slot="panel" :params="addGdtypeExtract" @reloadEvent="reloadGetData"></AddGoodsTypePanel>
    </ExtractPanel>
    <ExtractPanel :params="modGdtypeExtract">
        <span slot="title">修改商品类别</span>
        <ModGoodsTypePanel slot="panel" :params="modGdtypeExtract" @reloadEvent="reloadGetData"></ModGoodsTypePanel>
    </ExtractPanel>
    <ExtractPanel :params="sortGdtypeExtract">
        <span slot="title">修改商品类别排序 - 拖拽排序</span>
        <DragTreeSort slot="panel" 
            :list="sort.list"
            :pid="sort.pid"
            :params="sortGdtypeExtract" 
            @updateSort="updateGdtypeSort">
        </DragTreeSort>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddGoodsTypePanel from './AddGoodsTypePanel.vue'
import ModGoodsTypePanel from './ModGoodsTypePanel.vue'
import DragTreeSort from './DragTreeSort.vue'

import {getGdtypeInfo, delGdtypeRecord, updateGdtypeSort} from 'api'

export default {
    name: 'GoodsTypeManager',
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
            addGdtypeExtract: {
                isPlay: false
            },
            modGdtypeExtract: {
                isPlay: false
            },
            sortGdtypeExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addGdtypeHandle(){
            this.addGdtypeExtract.isPlay = !0
        },
        sortGdtypeHandle(arr, pid){
            this.sort.pid = pid
            this.sort.list = arr
            this.sortGdtypeExtract.isPlay = !0
            this.sortGdtypeExtract.recovery = !0
        },
        modItemHandle(_id){
            this.modGdtypeExtract.isPlay = !0
            this.modGdtypeExtract.itemId = _id
        },
        delItemHandle(_id){
            this.$confirm('确认删除此分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delGdtypeRecord({id: _id})
                    if (response.data.code == 1){
                        this.getGdtypeList()
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
        async getGdtypeList(callback){
            this.loading = !0
            try {
                const response = await getGdtypeInfo({
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
        async updateGdtypeSort(res, callback){
            try {
                const response = await updateGdtypeSort({
                    pid: res.pid,
                    sort: res.sort
                })
                if (response.data.code == 1){
                    // 更新陈功，不需要恢复数据
                    this.sortGdtypeExtract.recovery = false
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
                this.getGdtypeList()
            }
        },
        searchHandle(){
            this.getGdtypeList()
        },
        childTreeHandle(item){
            item.showChild = !item.showChild
        },
        resetList(){
            this.cloneList.forEach((item, i) => this.list.splice(i, 1, item))
        }
    },
    watch: {
        sortGdtypeExtract: {
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
        this.getGdtypeList()
    },
    components: {
        ExtractPanel,
        AddGoodsTypePanel,
        ModGoodsTypePanel,
        DragTreeSort
    }
}
</script>

<style>
.gdtype-search {
    width: 300px;
}
</style>