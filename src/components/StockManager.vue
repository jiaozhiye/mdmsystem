<template>
<div class="appManager-wrapper">
    <div class="appManager-top stock-top">
        <el-date-picker
            class="fl" 
            v-model="dateTime" 
            align="left" 
            type="date" 
            placeholder="选择日期" 
            value-format="yyyy-MM-dd" 
            @change="getDataList" 
            :picker-options="pickerOptions">
        </el-date-picker>
        <span>{{ promptMsg }}</span>
    </div>
    <div style="margin-top: 20px">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column v-for="(item, key) in thead" :key="key" 
                :prop="item.key" 
                :label="item.val" 
                :show-overflow-tooltip="item.key === 'title'">
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import moment from 'moment'

import {getSecurityStockInfo} from 'api'

export default {
    name: 'StockManager',
    data(){
        return {
            list: [],
            thead: {},
            promptMsg: '', // 提示计算公式
            loading: false,
            dateTime: moment().format('YYYY-MM-DD'),
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker){
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker){
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker){
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            }
        }
    },
    methods: {
        async getDataList(){
            this.loading = !0
            try {
                const response = await getSecurityStockInfo({
                    time: this.dateTime
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.thead = response.data.thead
                    this.list  = response.data.tbody
                    this.promptMsg = response.data.formula
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        }
    },
    created(){
        this.getDataList()
    }
}
</script>

<style>
.stock-top > span {
    line-height: 40px;
    margin-left: 10px;
    color: #999;
}
</style>