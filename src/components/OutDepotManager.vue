<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">出库日期：</strong>
        <el-date-picker
            class="fl"
            v-model="search.outDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="出库日期"
            @change="searchHandle">
        </el-date-picker>
        <el-select 
            class="fl" 
            style="width: 140px; margin-left: 10px;"
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
            style="width: 200px; margin-left: 10px;"
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
            placeholder="请输入出库单号" 
            prefix-icon="el-icon-search"
            v-model="search.orderCode" 
            @keyup.enter.native="searchHandle" 
            clearable>
        </el-input>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="出库单号" sortable></el-table-column>
            <el-table-column label="门店名称">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.store_text }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="want_date" label="要货日期" sortable></el-table-column>
            <el-table-column prop="arrive_date" label="到货日期" sortable></el-table-column>
            <el-table-column prop="warehourse_text" label="仓库"></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-view"></i> 详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="showOutOrderExtract" width="calc(100% - 200px)">
        <span slot="title">出库单详情</span>
        <OutOrderPanel slot="panel" :params="showOutOrderExtract" @reloadEvent="reloadGetData"></OutOrderPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'
import { setSearchParams } from 'assets/js/tools'

import ExtractPanel from './ExtractPanel.vue'
import OutOrderPanel from './OutOrderPanel.vue'

import { getOutOrderInfo, getDepotList, getStoreList, printOutOrder } from 'api'

export default {
    name: 'OutDepotManager',
    data(){
        return {
            list: [],
            depotList: [], // 仓库列表
            storeList: [], // 门店列表
            search: {
                outDate: '',
                depot: '',
                store: '',
                orderCode: ''
            },
            loading: false,
            showOutOrderExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        initOutDate(){
            this.search.outDate = moment().format('YYYY-MM-DD')
        },
        showItemHandle(_id){
            this.showOutOrderExtract.isPlay = !0
            this.showOutOrderExtract.id = _id
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
        async getOutOrderList(callback){
            try {
                this.loading = !0
                const response = await getOutOrderInfo({
                    outDate: this.search.outDate,
                    depot: this.search.depot,
                    store: this.search.store,
                    orderCode: this.search.orderCode
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getOutOrderList()
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getOutOrderList()
            }
        }
    },
    created(){
        this.initOutDate()
        this.getDepotList()
        this.getStoreList()
        this.getOutOrderList()
    },
    components: {
        ExtractPanel,
        OutOrderPanel
    }
}
</script>

<style>
</style>