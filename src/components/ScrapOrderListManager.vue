<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">废弃日期：</strong>
        <el-date-picker
            class="fl"
            style="width: 200px;"
            v-model="search.returnDate"
            type="date"
            placeholder="废弃日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="searchHandle">
        </el-date-picker>
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
            placeholder="请输入废弃单号" 
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
            <el-table-column prop="order_number" label="废弃单号" sortable></el-table-column>
            <el-table-column prop="order_number" label="废弃时间" sortable></el-table-column>
            <el-table-column label="状态" width="200">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id, scope.row.isEdit)" type="text">
                        <i class="el-icon-view"></i> 查看
                    </el-button>
                    <el-button :disabled="!scope.row.isEdit" @click.stop="stopItemHandle(scope.row)" type="text">
                        <i class="el-icon-delete"></i> 取消
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="showOrderExtract">
        <span slot="title">废弃单详情</span>
        <ShowScrapOrderPanel slot="panel" :params="showOrderExtract"></ShowScrapOrderPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import ShowScrapOrderPanel from './ShowScrapOrderPanel.vue'

import { getScrapOrderInfo, getScrapOrderStateList, changeScrapOrderState } from 'api'

export default {
    name: 'ScrapOrderListManager',
    data(){
        return {
            list: [],
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                returnDate: [],
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
        showItemHandle(_id, _isEdit){
            this.showOrderExtract.isPlay = !0
            this.showOrderExtract.id = _id
            this.showOrderExtract.isEdit = _isEdit
        },
        async getStateList(){
            try {
                const response = await getScrapOrderStateList()
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
                const response = await getScrapOrderInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    returnDate: this.search.returnDate,
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
        stopItemHandle(item){
            this.$confirm(`确认取消此废弃单吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await changeScrapOrderState({ id: item.id })
                    if (response.data.code == 1){
                        this.getOrderList(this.curPageIndex)
                        this.$message.success(response.data.message)
                    } else {
                        this.$message.error(response.data.message)
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
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
        this.getStateList()
        this.getOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        ShowScrapOrderPanel
    }
}
</script>

<style>
</style>