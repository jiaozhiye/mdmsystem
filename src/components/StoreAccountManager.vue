<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">对账日期：</strong>
        <el-date-picker
            class="app-date-editor fl"
            v-model="search.date"
            type="daterange"
            range-separator="到"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchHandle">
        </el-date-picker>
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
    </div>
    <div class="appManager-list">
        <el-table class="el-origin-table" :data="list" border v-loading="loading">
            <el-table-column prop="code" label="物料编码" sortable></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="attribute_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="receive_num_sum" label="门店入库数量" sortable></el-table-column>
            <el-table-column prop="send_num_sum" label="物流出库数量" sortable></el-table-column>
            <el-table-column prop="sub_num" label="差异数量" sortable></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import moment from 'moment'

import { getStoreListForAccount, getReconciliationInfo } from 'api'

export default {
    name: 'StoreAccountManager',
    data(){
        return {
            list: [],
            storeList: [], // 门店列表
            search: {
                date: [],
                store: ''
            },
            loading: false
        }
    },
    methods: {
        initAccountDate(){
            this.search.date.push(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
        },
        async getStoreList(callback){
            try {
                const response = await getStoreListForAccount()
                if (response.data.code == 1){
                    this.storeList = response.data.list
                    this.search.store = response.data.selected_id
                } else {
                    this.$message.error(response.data.message)
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
        },
        async getAccountList(){
            try {
                this.loading = !0
                const response = await getReconciliationInfo({
                    startDate: this.search.date[0],
                    endDate: this.search.date[1],
                    storeId: this.search.store
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getAccountList()
        }
    },
    created(){
        this.initAccountDate()
        this.getStoreList(() => {
            this.getAccountList()
        })
    }
}
</script>

<style>
</style>