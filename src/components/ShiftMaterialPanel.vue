<template>
    <div class="out-order-panel">
        <div class="appManager-top">
            <el-select 
                class="fl" 
                v-model="search.classify" 
                clearable 
                placeholder="原材料类别"
                @change="searchHandle">
                <el-option
                    v-for="(item, key) in materialClassifyList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-input 
                class="fl" 
                style="width: 220px; margin-left: 10px;"
                placeholder="请输入原材料名称/编号" 
                prefix-icon="el-icon-search"
                v-model="search.name" 
                @keyup.enter.native="searchHandle" 
                clearable>
            </el-input>
            <el-button class="fr" type="primary" @click.stop="submitHandle">保存</el-button>
        </div>
        <div style="padding: 20px 0">
            <el-table :data="list" border v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="stock_num" label="所属分类"></el-table-column>
                <el-table-column prop="code" label="编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="send_num" label="价格"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
        </div>
    </div>
</template>

<script>
import { getMaterialClassify, getDepotMaterialInfo } from 'api'

export default {
    name: 'ShiftMaterialPanel',
    props: {
        params: Object
    },
    data(){
        return {
            materialClassifyList: [],
            search: {
                classify: '',
                name: ''
            },
            list: [],
            loading: false,
            multipleSelection: [] // 选中记录的数组
        }
    },
    methods: {
        async getMaterialClassify(){
            try {
                const response = await getMaterialClassify()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.materialClassifyList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getMaterialList(){
            try {
                this.loading = !0
                const response = await getDepotMaterialInfo({
                    outWarehouseId: this.params.out_id,
                    type2: this.search.classify,
                    keyword: this.search.name
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
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        searchHandle(){
            this.getMaterialList()
        },
        submitHandle(){  
            this.$emit('reloadEvent', this.multipleSelection)
            this.closePanelHandle()
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    },
    created(){
        this.getMaterialClassify()
        this.getMaterialList()
    }
}
</script>

<style>
.out-order-panel {
    padding: 20px;
    overflow: hidden;
}
</style>