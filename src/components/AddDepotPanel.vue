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
            <el-input v-model="form.code" clearable placeholder="若不填写，系统自动生成" ></el-input>
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
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import { saveDepotRecord } from 'api'

export default {
    name: 'AddDepotPanel',
    props: {
        params: Object
    },
    data(){
        return {
            form: {
                name: '',
                code: '',
                desc: ''
            }
        }
    },
    methods: {
        submitHandle(){
            this.insertDepotInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertDepotInfo(callback){
            if (this.form.name == ''){
                return this.$message.warning('请正确填写门仓库息再提交！')
            }
            try {
                const response = await saveDepotRecord({
                    name: this.form.name,
                    code: this.form.code,
                    desc: this.form.desc
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.$message.success('添加仓库成功!')
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
    }
}
</script>

<style>
</style>