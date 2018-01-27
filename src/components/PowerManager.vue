<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addDataHandle">新增职务</el-button>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="职务名称" width="200"></el-table-column>
            <el-table-column prop="staffs_count" label="人数" width="100"></el-table-column>
            <el-table-column prop="staffs" label="人员"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="addPowerExtract">
        <span slot="title">新增职务</span>
        <AddPowerPanel slot="panel" :params="addPowerExtract" @reloadEvent="reloadGetData"></AddPowerPanel>
    </ExtractPanel>
    <ExtractPanel :params="modPowerExtract">
        <span slot="title">修改职务信息</span>
        <ModPowerPanel slot="panel" :params="modPowerExtract" @reloadEvent="reloadGetData"></ModPowerPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddPowerPanel from './AddPowerPanel.vue'
import ModPowerPanel from './ModPowerPanel.vue'

import {getPowerInfo, delPowerRecord} from 'api'

export default {
    name: 'PowerManager',
    data(){
        return {
            list: [],
            loading: false,
            addPowerExtract: {
                isPlay: false
            },
            modPowerExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addDataHandle(){
            this.addPowerExtract.isPlay = true
        },
        modItemHandle(_id){
            this.modPowerExtract.isPlay = true
            this.modPowerExtract.itemId = _id
        },
        delItemHandle(_id){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await delPowerRecord({id: _id})
                    if (response.data.code == 1){
                        this.removeItemById(_id)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        async getPowerList(){
            this.loading = !0
            try {
                const response = await getPowerInfo()
                // console.log(response.data)
                this.list = response.data.list
            } catch (error){
                console.error(error)
            }
             this.loading = !1
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getPowerList()
            }
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        }
    },
    created(){
        this.getPowerList()
    },
    components: {
        ExtractPanel,
        AddPowerPanel,
        ModPowerPanel
    }
}
</script>

<style>
.power-setting {
    padding-top: 0px;
    line-height: 24px;
    vertical-align: middle;
}
.power-setting .icon {
    font-size: 16px;
    color: #409eff;
}
</style>