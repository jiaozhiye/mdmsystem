<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">出库日期：</strong>
        <el-date-picker
            class="app-date-editor fl"
            v-model="search.outDate"
            type="daterange"
            range-separator="到"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchHandle">
        </el-date-picker>
        <el-select 
            class="fl" 
            style="width: 180px; margin-left: 10px;"
            v-model="search.depot" 
            placeholder="选择仓库"
            clearable
            @change="searchHandle">
            <el-option
                v-for="(item, key) in depotList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="width: 180px; margin-left: 10px;"
            v-model="search.store" 
            clearable 
            @change="searchHandle" 
            placeholder="选择门店">
            <el-option
                v-for="(item, key) in storeList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="width: 140px; margin-left: 10px;"
            v-model="search.state" 
            @change="searchHandle" 
            placeholder="选择状态">
            <el-option
                v-for="(item, key) in stateList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="出库单号"></el-table-column>
            <el-table-column prop="store_name" label="出库日期" sortable></el-table-column>
            <el-table-column prop="create_time" label="门店" sortable></el-table-column>
            <el-table-column prop="create_time" label="仓库"></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.dname }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-view"></i> 查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="showOrderExtract" width="60%">
        <span slot="title">出库单详情</span>
        <LogisticsRetOrdPanel slot="panel" :params="showOrderExtract"></LogisticsRetOrdPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'

import ExtractPanel from './ExtractPanel.vue'
import LogisticsRetOrdPanel from './LogisticsRetOrdPanel.vue'

import { getLogisticsRetOrdInfo, getDepotList, getStoreList, getRetOrdStateList } from 'api'

export default {
    name: 'OutOrderManager',
    data(){
        return {
            list: [],
            depotList: [], // 仓库列表
            storeList: [], // 门店列表
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                outDate: [],
                depot: '',
                store: '',
                state: ''
            },
            loading: false,
            showOrderExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        initOutDepotDate(){
            let oDate = new Date()
            this.search.outDate.push(moment(oDate).format('YYYY-MM-DD'))
            this.search.outDate.push(moment(oDate.setDate(oDate.getDate() + 3)).format('YYYY-MM-DD'))
        },
        showItemHandle(_id){
            this.showOrderExtract.isPlay = !0
            this.showOrderExtract.id = _id
        },
        async getDepotList(){
            try {
                const response = await getDepotList()
                if (response.data.code == 1){
                    this.depotList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStoreList(){
            try {
                const response = await getStoreList()
                if (response.data.code == 1){
                    this.storeList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStateList(){
            try {
                const response = await getRetOrdStateList()
                if (response.data.code == 1){
                    this.stateList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getOutOrderList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            try {
                this.loading = !0
                const response = await getLogisticsRetOrdInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    date: this.search.outDate,
                    depot: this.search.depot,
                    store: this.search.store,
                    state: this.search.state
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.orderList.list
                    this.list.total = response.data.orderList.totalRow
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
            this.getOutOrderList(index)
        },
        searchHandle(){
            this.getOutOrderList(1)
        }
    },
    created(){
        this.initOutDepotDate()
        this.getDepotList()
        this.getStoreList()
        this.getStateList()
        this.getOutOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        LogisticsRetOrdPanel
    }
}
</script>

<style>
</style>