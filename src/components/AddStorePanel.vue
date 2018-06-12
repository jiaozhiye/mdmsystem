<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>选择城市</label>
        <div class="app-input-block">
            <el-select v-model="form.cityId" clearable placeholder="请选择城市">
                <el-option v-for="(item, key) in cityList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
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
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import { getCitysInfo, saveStoreRecord } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'AddStorePanel',
    props: {
        params: Object
    },
    data(){
        return {
            cityList: [],
            form: {
                cityId: '',
                name: '',
                address: '',
                phone: '',
                desc: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        submitHandle(){
            this.insertStoreInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async getCityList(){
            try {
                const response = await getCitysInfo()
                if (response.data.code == 1){
                    this.cityList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async insertStoreInfo(callback){
            if (this.form.cityId == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写门店信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveStoreRecord({
                    city: this.form.cityId,
                    name: this.form.name,
                    address: this.form.address,
                    phone: this.form.phone,
                    desc: this.form.desc
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '添加门店成功!'
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
    },
    created (){
        this.getCityList()
    }
}
</script>

<style>
</style>