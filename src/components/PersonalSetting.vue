<template>
<div class="persetting-wrapper">
    <div>
        <h4 class="form-group-apart">
            <i class="icon el-icon-edit-outline"></i>基本信息
        </h4>
        <div class="app-form-item">
            <label class="app-form-label">姓名:</label>
            <div class="app-input-block">
                <span>{{ form.name }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">性别:</label>
            <div class="app-input-block">
                <span>{{ form.gender }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">部门:</label>
            <div class="app-input-block">
                <span>{{ form.dept }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">职务:</label>
            <div class="app-input-block">
                <span>{{ form.job }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">电话:</label>
            <div class="app-input-block">
                <span>{{ form.phone }}</span>
            </div>
        </div>
        <h4 class="form-group-apart">
            <i class="icon el-icon-edit-outline"></i>帐号信息
        </h4>
        <div class="app-form-item">
            <label class="app-form-label">邮箱:</label>
            <div class="app-input-block">
                <span>{{ form.email }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">密码:</label>
            <div class="app-input-block">
                <span class="password">● ● ● ● ● ● ● ●</span>
                <el-button type="text" @click.stop="modPwdHandle">修改</el-button>
            </div>
        </div>
    </div>
    <ExtractPanel :params="modPwdExtract">
        <span slot="title">修改个人密码</span>
        <ModPwdPanel slot="panel" :params="modPwdExtract"></ModPwdPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import ModPwdPanel from './ModPwdPanel.vue'

import {getUserAllInfo} from 'api'

export default {
    name: 'PersonalSetting',
    data(){
        return {
            form: {
                name: '',
                gender: '',
                dept: '',
                job: '',
                phone: '',
                email: '',
                password: ''
            },
            modPwdExtract: {
                isPlay: false,
                promptTitle: '修改个人登录密码'
            }
        }
    },
    methods: {
        modPwdHandle(){
            this.modPwdExtract.isPlay = true
        },
        async getItemInfo(){
            try {
                const response = await getUserAllInfo()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.name = response.data.data.name
                    this.form.gender = response.data.data.gender_text
                    this.form.dept = response.data.data.dept_text
                    this.form.job = response.data.data.job_text
                    this.form.phone = response.data.data.phone
                    this.form.email = response.data.data.email   
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
    },
    created(){
        this.getItemInfo()
    },
    components: {
        ExtractPanel,
        ModPwdPanel
    }
}
</script>

<style>
.persetting-wrapper {}
.persetting-wrapper .password {
    display: inline-block;
    width: 200px;
}
</style>