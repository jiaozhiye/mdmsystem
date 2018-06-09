<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <strong class="promptText fl">移库日期：</strong>
        <el-date-picker
            class="fl"
            style="width: 200px;"
            v-model="search.moveDepotDate"
            type="date"
            placeholder="移库日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="searchHandle">
        </el-date-picker>
        <el-select 
            class="fl" 
            style="margin-left: 10px;"
            v-model="search.outDepotId" 
            clearable 
            placeholder="移出仓库"
            @change="searchHandle">
            <el-option
                v-for="(item, key) in depotOutList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="margin-left: 10px;"
            v-model="search.inDepotId" 
            clearable 
            placeholder="移入仓库"
            @change="searchHandle">
            <el-option
                v-for="(item, key) in depotInList"
                :key="key"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="width: 150px; margin-left: 10px;"
            v-model="search.state" 
            @change="searchHandle" 
            placeholder="选择状态"
            clearable>
            <el-option
                v-for="(item, key) in stateList"
                :key="key"
                :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button class="fr" type="primary" @click.stop="creareMoveDepotHandle">新建</el-button>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="order_number" label="单号"></el-table-column>
            <el-table-column prop="create_time" label="移库日期" sortable></el-table-column>
            <el-table-column prop="out_warehouse_name" label="移出仓库"></el-table-column>
            <el-table-column prop="in_warehouse_name" label="移入仓库"></el-table-column>
            <el-table-column prop="creater_name" label="操作人"></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status_color" size="medium">{{ scope.row.status_text }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="showItemHandle(scope.row.id, scope.row.isEdit)" type="text">
                        <i class="el-icon-view"></i> 查看
                    </el-button>
                    <el-button @click.stop="" type="text">
                        <i class="el-icon-view"></i> 打印
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <ExtractPanel :params="showOrderExtract" width="calc(100% - 200px)">
        <span slot="title">移库单详情</span>
        <ModMoveDepotPanel slot="panel" :params="showOrderExtract" @reloadEvent="reloadGetData"></ModMoveDepotPanel>
    </ExtractPanel>
</div>
</template>

<script>
import moment from 'moment'

import ExtractPanel from './ExtractPanel.vue'
import ModMoveDepotPanel from './ModMoveDepotPanel.vue'

import { getDepotInfoSelect, getMoveDepotInfo } from 'api'

export default {
    name: 'MoveDepotManager',
    data(){
        return {
            list: [],
            depotOutList: [],
            depotInList: [],
            stateList: [], // 状态列表
            curPageIndex: 1, // 当前页码
            search: {
                moveDepotDate: moment().format('YYYY-MM-DD'),
                outDepotId: '',
                inDepotId: '',
                state: ''
            },
            loading: false,
            showOrderExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        creareMoveDepotHandle(){
            this.$router.push('/stock_manager_1/create_movement')
        },
        showItemHandle(_id, _isEdit){
            this.showOrderExtract.isPlay = !0
            this.showOrderExtract.id = _id
            this.showOrderExtract.isEdit = _isEdit
        },
        async getDepotList(){
            try {
                const response = await getDepotInfoSelect()
                if (response.data.code == 1){
                    response.data.list.splice(0, 1) // 删除 全部 的记录
                    this.depotOutList = response.data.list
                    this.depotInList  = _.cloneDeep(response.data.list)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        getStateList(){
            this.stateList = [{name: '全部', value: '-1'}, {name: '已保存', value: '20'}, {name: '已确认', value: '30'}]
        },
        async getOrderList(curPage, callback){
            curPage = curPage > 0 ? Number(curPage) : this.curPageIndex
            try {
                this.loading = !0
                const response = await getMoveDepotInfo({
                    pageNum: curPage,
                    pageSize: 10,
                    outWarehouseId: this.search.outDepotId,
                    inWarehouseId: this.search.inDepotId,
                    date: this.search.moveDepotDate,
                    status: this.search.state
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
        }
    },
    created(){
        this.getDepotList()
        this.getStateList()
        this.getOrderList(this.curPageIndex)
    },
    components: {
        ExtractPanel,
        ModMoveDepotPanel
    }
}
</script>

<style>
</style>