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
            clearable
            @change="searchHandle" 
            placeholder="选择状态">
            <el-option
                v-for="(item, key) in stateList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="width: 120px; margin-left: 10px;"
            v-model="search.printFlag"
            clearable 
            @change="searchHandle" 
            placeholder="打印标识">
            <el-option
                v-for="(item, key) in printList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="出库单号" sortable></el-table-column>
            <el-table-column prop="out_time" label="出库日期" sortable></el-table-column>
            <el-table-column label="门店名称" min-width="150">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_text }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="warehourse_text" label="仓库"></el-table-column>
            <el-table-column prop="print_time" label="打印次数" width="120" sortable></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-view"></i> 查看
                    </el-button>
                    <el-button @click.stop="printHandle(scope.row.id)" type="text">
                        <i class="el-icon-printer"></i> 打印
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="showOrderExtract">
        <span slot="title">出库单详情</span>
        <OrderDetailPanel slot="panel" :params="showOrderExtract"></OrderDetailPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'
import { setSearchParams } from 'assets/js/tools'

import ExtractPanel from './ExtractPanel.vue'
import OrderDetailPanel from './OrderDetailPanel.vue'

import { getLogisticsOutOrder, getDepotList, getStoreList, getOutDepotStateList, printOutOrder } from 'api'

export default {
    name: 'OutOrderManager',
    data(){
        return {
            list: [],
            depotList: [], // 仓库列表
            storeList: [], // 门店列表
            stateList: [], // 状态列表
            printList: [{name: '全部', value: '-1'}, {name: '未打印', value: '0'}, {name: '已打印', value: '1'}], // 打印标志
            curPageIndex: 1, // 当前页码
            search: {
                outDate: [],
                depot: '',
                store: '',
                state: '',
                printFlag: ''
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
            this.showOrderExtract.type = 'logistic'  // 物流订单详情
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
                const response = await getOutDepotStateList()
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
                const response = await getLogisticsOutOrder({
                    pageNum: curPage,
                    pageSize: 10,
                    date: this.search.outDate,
                    depot: this.search.depot,
                    store: this.search.store,
                    state: this.search.state,
                    printFlag: this.search.printFlag
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
        async printHandle(_id){
            try {
                const response = await printOutOrder({ id: _id })
                // console.log(response.data)
                if (response.data.code == 1){
                    window.open(`/static/print.html${setSearchParams(response.data.data)}`, '_blank')
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
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
        OrderDetailPanel
    }
}
</script>

<style>
</style>