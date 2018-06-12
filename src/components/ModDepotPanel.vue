<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>仓库名称</label>
        <div class="app-input-block">
            <el-input name="depotname" v-model="form.name" v-validate="'required'" :class="{'formDanger': errors.has('depotname')}" clearable placeholder="请输入仓库名称..." ></el-input>
            <span v-if="errors.has('depotname')" class="prompt-title">{{ errors.first('depotname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">仓库编码</label>
        <div class="app-input-block">
            <el-input v-model="form.code" disabled placeholder="若不填写，系统自动生成" ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">仓库描述</label>
        <div class="app-input-block">
            <el-input :rows="5" type="textarea" v-model="form.desc" clearable placeholder="请输入仓库描述..." ></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import { getDepotRecord, updateDepotRecord } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'ModDepotPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                name: '',
                code: '',
                desc: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getDepotRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.name = response.data.data.name || ''
                    this.form.code = response.data.data.code
                    this.form.desc = response.data.data.desc
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        submitHandle(){
            this.updateDepotInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateDepotInfo(callback){
            try {
                const response = await updateDepotRecord({
                    id: this.itemId,
                    name: this.form.name,
                    // code: this.form.code,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message.success('修改仓库成功!')
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    },
    created(){
        this.getItemInfo()
    }
}
</script>

<style>
</style>