<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>单位名称</label>
        <div class="app-input-block">
            <el-input name="unitname" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('unitname')}" clearable placeholder="请输入单位名称..." ></el-input>
            <span v-if="errors.has('unitname')" class="prompt-title">{{ errors.first('unitname') }}</span>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {saveUnitInfo} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'AddUnitPanel',
    props: {
        params: Object
    },
    data(){
        return {
            form: {
                name: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        submitHandle(){  
            this.insertUnitInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertUnitInfo(callback){
            if (this.form.name == ''){
                return this.$message({
                    message: '请正确填写单位信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveUnitInfo({
                    name: this.form.name
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '单位添加成功!'
                    })
                    callback && callback()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            } catch (err){
                console.error(err)
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