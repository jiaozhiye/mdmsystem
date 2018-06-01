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
            style="width: 150px; margin-left: 10px;"
            v-model="search.orderType" 
            clearable 
            @change="searchHandle" 
            placeholder="订单类型">
            <el-option
                v-for="(item, key) in orderTypeList"
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
    <!-- <div class="appManager-top" style="margin-top: 20px">
        <ul class="fr">
            <el-button type="primary">接收</el-button>
            <el-button type="primary">生成出库订单</el-button>
        </ul>
    </div> -->
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="订单号" sortable></el-table-column>
            <el-table-column prop="store_text" label="门店"></el-table-column>
            <el-table-column prop="want_date" label="订货日期" sortable></el-table-column>
            <el-table-column prop="arrive_date" label="到货日期" sortable></el-table-column>
            <el-table-column prop="type_text" label="订单类型"></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time_short" label="提交日期"></el-table-column>
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
    <ExtractPanel :params="showOrderExtract">
        <span slot="title">订单详情</span>
        <OrderDetailPanel slot="panel" :params="showOrderExtract"></OrderDetailPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'

import ExtractPanel from './ExtractPanel.vue'
import OrderDetailPanel from './OrderDetailPanel.vue'

import { getOrderInfo, getOrderTypeList, getOrderStateList } from 'api'

export default {
    name: 'StoreOrderManager',
    data(){
        return {
            list: [],
            orderTypeList: [], // 订单类型列表
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                arrivalDate: [],
                orderType: '',
                state: '10',
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
        async getStateList(){
            try {
                const response = await getOrderStateList()
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
        }
    },
    created(){
        this.initArrivalDate()
        this.getOrderTypeList()
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