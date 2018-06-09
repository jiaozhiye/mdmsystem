<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">退货日期：</strong>
        <el-date-picker
            class="app-date-editor fl"
            v-model="search.returnDate"
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
            style="width: 150px; margin-left: 10px;"
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
        <el-input 
            class="fr" 
            style="width: 220px;"
            placeholder="请输入订单号" 
            prefix-icon="el-icon-search"
            v-model="search.orderCode" 
            @keyup.enter.native="searchHandle" 
            clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="订单编号" sortable></el-table-column>
            <el-table-column label="门店名称">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" sortable></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.dname }}</el-tag>
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
        <span slot="title">物流退货单详情</span>
        <LogisticsRetOrdPanel slot="panel" :params="showOrderExtract" @reloadEvent="reloadGetData"></LogisticsRetOrdPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'

import ExtractPanel from './ExtractPanel.vue'
import LogisticsRetOrdPanel from './LogisticsRetOrdPanel.vue'

import { getLogisticsRetOrdInfo, getStoreList, getRetOrdStateList } from 'api'

export default {
    name: 'LogisticsRetOrdManager',
    data(){
        return {
            list: [],
            storeList: [], // 门店列表
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                returnDate: [],
                store: '',
                state: '',
                orderCode: ''
            },
            loading: false,
            showOrderExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        initArrivalDate(){
            let oDate = new Date()
            this.search.returnDate.push(moment(oDate).format('YYYY-MM-DD'))
            this.search.returnDate.push(moment(oDate.setDate(oDate.getDate() + 3)).format('YYYY-MM-DD'))
        },
        showItemHandle(_id){
            this.showOrderExtract.isPlay = !0
            this.showOrderExtract.id = _id
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
        async getReturnOrderList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            try {
                this.loading = !0
                const response = await getLogisticsRetOrdInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    returnDate: this.search.returnDate,
                    store: this.search.store,
                    state: this.search.state,
                    orderCode: this.search.orderCode
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
            this.getReturnOrderList(index)
        },
        searchHandle(){
            this.getReturnOrderList(1)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getReturnOrderList(this.curPageIndex)
            }
        }
    },
    created(){
        this.initArrivalDate()
        this.getStoreList()
        this.getStateList()
        this.getReturnOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        LogisticsRetOrdPanel
    }
}
</script>

<style>
</style>