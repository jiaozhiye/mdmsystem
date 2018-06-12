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
import {getUnitRecord, updateUnitRecord} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'ModUnitPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                name: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getUnitRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.name = response.data.data.name || ''
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
        submitHandle(){
            this.updateUnitInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateUnitInfo(callback){
            try {
                const response = await updateUnitRecord({
                    id: this.itemId,
                    name: this.form.name
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '修改单位成功!'
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
    },
    created(){
        this.getItemInfo()
    }
}
</script>

<style>
</style>