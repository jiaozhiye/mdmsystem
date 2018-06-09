<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">到货日期：</strong>
        <el-date-picker
            class="app-date-editor fl"
            v-model="search.arrivalDate"
            type="daterange"
            range-separator="到"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchHandle">
        </el-date-picker>
        <el-select 
            class="fl" 
            style="width: 120px; margin-left: 10px;"
            v-model="search.orderType" 
            clearable 
            @change="searchHandle" 
            placeholder="订单类型">
            <el-option
                v-for="(item, key) in orderTypeList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="width: 140px; margin-left: 10px;"
            v-model="search.state" 
            @change="searchHandle" 
            clearable
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
        <el-input 
            class="fr" 
            style="width: 180px;"
            placeholder="请输入订单号" 
            prefix-icon="el-icon-search"
            v-model="search.orderCode" 
            @keyup.enter.native="searchHandle" 
            clearable>
        </el-input>
    </div>
    <!-- <div class="appManager-top" style="margin-top: 20px">
        <ul class="fr">
            <el-button type="primary">接收</el-button>
            <el-button type="primary">生成出库订单</el-button>
        </ul>
    </div> -->
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="订单号" sortable></el-table-column>
            <el-table-column label="门店名称">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_text }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="want_date" label="订货日期" sortable></el-table-column>
            <el-table-column prop="arrive_date" label="到货日期" sortable></el-table-column>
            <el-table-column prop="type_text" label="订单类型"></el-table-column>
            <el-table-column prop="print_time" label="打印次数"></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time_short" label="提交日期"></el-table-column>
            <el-table-column label="操作" width="310">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-view"></i> 查看
                    </el-button>
                    <el-button @click.stop="receiveOrderHandle(scope.row)" type="text">
                        <i class="el-icon-edit-outline"></i> 接收
                    </el-button>
                    <el-button @click.stop="createOutOrderHandle(scope.row.id)" type="text">
                        <i class="el-icon-document"></i> 生成出库单
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
        <span slot="title">订单详情</span>
        <OrderDetailPanel slot="panel" :params="showOrderExtract" @reloadEvent="reloadGetData"></OrderDetailPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'
import { setSearchParams } from 'assets/js/tools'

import ExtractPanel from './ExtractPanel.vue'
import OrderDetailPanel from './OrderDetailPanel.vue'

import { getOrderInfo, getOrderTypeList, getStoreList, getOrderStateList, receiveOrder, createOutOrder, printGoodsOrder } from 'api'

export default {
    name: 'LogisticsManager',
    data(){
        return {
            list: [],
            orderTypeList: [], // 订单类型列表
            storeList: [], // 门店列表
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                arrivalDate: [],
                orderType: '',
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
            this.search.arrivalDate.push(moment(oDate).format('YYYY-MM-DD'))
            this.search.arrivalDate.push(moment(oDate.setDate(oDate.getDate() + 3)).format('YYYY-MM-DD'))
        },
        showItemHandle(_id){
            this.showOrderExtract.isPlay = !0
            this.showOrderExtract.id = _id
            this.showOrderExtract.type = 'logistic'  // 物流订单详情
        },
        async printHandle(_id){
            try {
                const response = await printGoodsOrder({ id: _id })
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
        async getOrderTypeList(){
            try {
                const response = await getOrderTypeList()
                if (response.data.code == 1){
                    this.orderTypeList = response.data.list
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
                const response = await getOrderStateList({ dict: 'logistics_view_order_type' })
                if (response.data.code == 1){
                    this.stateList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getOrderList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            try {
                this.loading = !0
                const response = await getOrderInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    arrivalDate: this.search.arrivalDate,
                    orderType: this.search.orderType,
                    store: this.search.store,
                    state: this.search.state,
                    orderCode: this.search.orderCode
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
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getOrderList(index)
        },
        searchHandle(){
            this.getOrderList(1)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getOrderList(this.curPageIndex)
            }
        },
        async receiveOrderHandle(item){
            try {
                const response = await receiveOrder({ id: item.id })
                if (response.data.code == 1){
                    // 修改状态
                    item.status = '200'
                    item.status_text = '已接收'
                    // this.$message.success(response.data.message)
                    setTimeout(() => {
                        this.getOrderList(this.curPageIndex)
                    }, 500)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async createOutOrderHandle(_id){
            try {
                const response = await createOutOrder({ id: _id })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    this.getOrderList(this.curPageIndex)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        }
    },
    created(){
        this.initArrivalDate()
        this.getOrderTypeList()
        this.getStoreList()
        this.getStateList()
        this.getOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        OrderDetailPanel
    }
}
</script>

<style>
</style>