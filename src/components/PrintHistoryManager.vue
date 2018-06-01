<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <ul class="fr">
            <el-select 
                class="fl" 
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
            <el-input 
                class="fl" 
                style="width: 200px; margin-left: 10px;"
                placeholder="请输入订单号" 
                prefix-icon="el-icon-search"
                v-model="search.orderCode" 
                @keyup.enter.native="searchHandle" 
                clearable>
            </el-input>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table class="el-origin-table" :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="订单号" sortable></el-table-column>
            <el-table-column prop="creater_name" label="打印人"></el-table-column>
            <el-table-column prop="print_date" label="打印时间" sortable></el-table-column>
            <el-table-column prop="sort" label="第几次打印"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
import { printOrderType, getPrintOrderInfo } from 'api'

export default {
    name: 'PrintHistoryManager',
    data(){
        return {
            orderTypeList: [],
            list: [],
            curPageIndex: 1, // 当前页码
            search: {
                orderType: '',
                orderCode: ''
            },
            loading: false
        }
    },
    methods: {
        async getOrderTypeList(){
            try {
                const response = await printOrderType()
                if (response.data.code == 1){
                    this.orderTypeList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getPrintOrderList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            try {
                this.loading = !0
                const response = await getPrintOrderInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    orderId: this.search.orderType,
                    orderNumber: this.search.orderCode
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
            this.getPrintOrderList(index)
        },
        searchHandle(){
            this.getPrintOrderList(1)
        }
    },
    created(){
        this.getOrderTypeList()
        this.getPrintOrderList(this.curPageIndex)
    }
}
</script>

<style>
</style>