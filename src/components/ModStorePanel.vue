<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>门店名称</label>
        <div class="app-input-block">
            <el-input name="storename" v-model="form.name" v-validate="'required'" :class="{'formDanger': errors.has('storename')}" clearable placeholder="请输入门店名称..." ></el-input>
            <span v-if="errors.has('storename')" class="prompt-title">{{ errors.first('storename') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>门店地址</label>
        <div class="app-input-block">
            <el-input v-model="form.address" clearable placeholder="请输入门店地址..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">门店电话</label>
        <div class="app-input-block">
            <el-input v-model="form.phone" clearable placeholder="请输入门店电话..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">门店描述</label>
        <div class="app-input-block">
            <el-input :rows="5" type="textarea" v-model="form.desc" clearable placeholder="请输入门店描述..." ></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getStoreRecord, updateStoreRecord} from 'api'

export default {
    name: 'ModStorePanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                name: '',
                address: '',
                phone: '',
                desc: ''
            }
        }
    },
    created(){
        this.getItemInfo()
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getStoreRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.name = response.data.data.name || ''
                    this.form.address = response.data.data.address
                    this.form.phone = response.data.data.phone
                    this.form.desc = response.data.data.desc
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            } catch (error){
                console.error(error)
            }
        },
        submitHandle(){
            this.updateStoreInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateStoreInfo(callback){
            try {
                const response = await updateStoreRecord({
                    id: this.itemId,
                    name: this.form.name,
                    address: this.form.address,
                    phone: this.form.phone,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '修改部门成功!'
                    })
                    callback && callback()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
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