<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-dropdown class="fl">
            <el-button type="primary">
                新建操作 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="createRetOrdHandle()">退货单</el-dropdown-item>
                <el-dropdown-item @click.native="createRetOrdHandle('hidden')">引单退货单</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <ul class="fr">
            <el-select 
                class="fl" 
                style="margin-right: 10px;"
                v-model="search.state" 
                @change="searchHandle" 
                placeholder="退货单状态"
                clearable>
                <el-option
                    v-for="(item, key) in stateList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input 
                class="fl" 
                style="width: 220px;"
                placeholder="请输入退货单号" 
                prefix-icon="el-icon-search"
                v-model="search.orderCode" 
                @keyup.enter.native="searchHandle" 
                clearable>
            </el-input>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="退货单号"></el-table-column>
            <el-table-column prop="return_time" label="退货日期" sortable></el-table-column>
            <el-table-column prop="store_name" label="门店名称"></el-table-column>
            <el-table-column label="订单状态" width="200">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.dname }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id, scope.row.isEdit)" type="text">
                        <i class="el-icon-view"></i> 详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="showRetOrdExtract" width="calc(100% - 200px)">
        <span slot="title">{{ showRetOrdExtract.type }}退货单详情</span>
        <ModReturnOrderPanel slot="panel" :params="showRetOrdExtract"></ModReturnOrderPanel>
    </ExtractPanel>
    <ExtractPanel :params="addRetOrdExtract" width="calc(100% - 200px)">
        <span slot="title">新增{{ addRetOrdExtract.type }}退货单</span>
        <AddReturnOrderPanel slot="panel" :params="addRetOrdExtract"></AddReturnOrderPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import ModReturnOrderPanel from './ModReturnOrderPanel.vue'
import AddReturnOrderPanel from './AddReturnOrderPanel.vue'

import { getReturnOrderInfo, getRetOrdStateList } from 'api'

export default {
    name: 'ReturnOrderManager',
    data(){
        return {
            list: [],
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                state: '',
                orderCode: ''
            },
            loading: false,
            showRetOrdExtract: {
                type: '', // 退货单类型   引单
                isPlay: false
            },
            addRetOrdExtract: {
                type: '', // 退货单类型   引单
                isPlay: false
            }
        }
    },
    methods: {
        createRetOrdHandle(isHidden){
            this.addRetOrdExtract.isPlay = !0
            if (isHidden === 'hidden'){
                this.addRetOrdExtract.type = '引单'
            } else {
                this.addRetOrdExtract.type = ''
            }
        },
        showItemHandle(_id, _isEdit){
            this.showRetOrdExtract.isPlay = !0
            this.showRetOrdExtract.id = _id
            if (_isEdit){
                this.showRetOrdExtract.type = ''
            } else {
                this.showRetOrdExtract.type = '引单'
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
                const response = await getReturnOrderInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    status: this.search.state,
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
        }
    },
    created(){
        this.getStateList()
        this.getReturnOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        AddReturnOrderPanel,
        ModReturnOrderPanel
    }
}
</script>

<style>
</style>