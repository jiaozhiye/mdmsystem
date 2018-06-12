<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>登录帐号</label>
        <div class="app-input-block">
            <el-input name="account" v-model="form.account" v-validate="'required'" :class="{'formDanger': errors.has('account')}" clearable placeholder="请输入登录帐号..." ></el-input>
            <span v-if="errors.has('account')" class="prompt-title">{{ errors.first('account') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>密码</label>
        <div class="app-input-block">
            <el-input name="password" v-model="form.password" v-validate="'required|spechar'" :class="{'formDanger': errors.has('password')}" clearable placeholder="请输入密码..." ></el-input>
            <span v-if="errors.has('password')" class="prompt-title">{{ errors.first('password') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>姓名</label>
        <div class="app-input-block">
            <el-input name="username" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('username')}" clearable placeholder="请输入姓名..." ></el-input>
            <span v-if="errors.has('username')" class="prompt-title">{{ errors.first('username') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">性别</label>
        <div class="app-input-block">
            <el-radio v-model="form.sex" label="1">男</el-radio>
            <el-radio v-model="form.sex" label="0">女</el-radio>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">手机号</label>
        <div class="app-input-block">
            <el-input name="phone" v-model="form.phone" v-validate="'phone'" :class="{'formDanger': errors.has('phone')}" clearable placeholder="请输入手机号..." ></el-input>
            <span v-if="errors.has('phone')" class="prompt-title">{{ errors.first('phone') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">邮箱</label>
        <div class="app-input-block">
            <el-input name="email" v-model="form.email" v-validate="'email'" :class="{'formDanger': errors.has('email')}" clearable placeholder="请输入邮箱..." ></el-input>
            <span v-if="errors.has('email')" class="prompt-title">{{ errors.first('email') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>部门</label>
        <div class="app-input-block">
            <el-select v-model="form.deptId" clearable placeholder="请选择部门">
                <el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>职务</label>
        <div class="app-input-block">
            <el-select v-model="form.jobId" clearable placeholder="请选择职务">
                <el-option v-for="(item, key) in jobList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {getJobInfo, getDeptList, saveEmployRecord} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'AddEmployPanel',
    props: {
        params: Object
    },
    data(){
        return {
            deptList: [],
            jobList: [],
            form: {
                account: '',
                password: '',
                name: '',
                sex: '1',
                phone: '',
                email: '',
                deptId: '',
                jobId: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getJobList(){
            try {
                const response = await getJobInfo()
                this.jobList = response.data
            } catch (error){
                console.error(error)
            }
        },
        async getDeptList(){
            try {
                const response = await getDeptList()
                this.deptList = response.data
            } catch (error){
                console.error(error)
            }
        },
        submitHandle(){
            this.insertDeptInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertDeptInfo(callback){
            if (this.form.account == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写员工信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveEmployRecord({
                    username: this.form.account,
                    password: this.form.password,
                    name: this.form.name,
                    gender: this.form.sex,
                    phone: this.form.phone,
                    email: this.form.email,
                    dept: this.form.deptId,
                    job: this.form.jobId
                })
                if (response.data.id){
                    this.$message({
                        type: 'success',
                        message: '添加员工成功!'
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
    created(){
        this.getDeptList()
        this.getJobList()
    }
}
</script>

<style>
</style>