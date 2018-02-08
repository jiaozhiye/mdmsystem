<template>
<div class="import-panel-wrapper">
    <el-alert
        v-show="alert.isPlay" 
        style="margin-bottom: 20px" 
        :title="alert.msg" 
        type="warning" 
        show-icon 
        close-text="继续" 
        @close="alertCloseHandle">
    </el-alert>
    <el-date-picker
        v-model="dateTime" 
        align="left" 
        type="date" 
        placeholder="选择日期" 
        value-format="yyyy-MM-dd" 
        @change="hasDailySummary" 
        :picker-options="pickerOptions">
    </el-date-picker>
    <el-upload
        v-if="!alert.isPlay" 
        style="margin-top: 20px" 
        ref="upload" 
        :action="reqUrl" 
        :on-success="handleSuccess" 
        :file-list="fileList" 
        :auto-upload="false" 
        :multiple="false" 
        :limit="1">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click.stop="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls、xml、html文件，且不超过2000kb</div>
    </el-upload>
</div>
</template>

<script>
import {getHasDailySummary} from 'api'

import common from 'common/js/common'
import moment from 'moment'

export default {
    name: 'ImportSalePanel',
    data(){
        return {
            alert: { // alert 提示框
                msg: '',
                isPlay: false
            },
            fileList: [],
            dateTime: moment().format('YYYY-MM-DD'),
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker){
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker){
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker){
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            }
        }
    },
    computed: {
        reqUrl(){
            return common.serverUrl + 'mgr/dailySummary/importDailySummary?impTime=' + this.dateTime
        }
    },
    methods: {
        alertCloseHandle(){
            this.alert.isPlay = !1
        },
        async hasDailySummary(){
            try {
                const response = await getHasDailySummary({
                    impTime: this.dateTime
                })
                // console.log(response)
                if (response.data.code == 1){ // 可以导入数据
                    this.alert.isPlay = !1
                    this.alert.msg = ''
                } else {
                    this.alert.isPlay = !0
                    this.alert.msg = response.data.message
                }
            } catch (err){
               console.error(err)
            }
        },
        submitUpload(){
            this.$refs.upload.submit()
        },
        handleSuccess(response, file, fileList){
            // console.log(response)
            if (response.code == 1){
                // 清空 fileList 数组
                this.fileList.splice(0)
                this.$emit('reloadEvent', response.imp_data, false)
            } else {
                this.$message({
                    type: 'error',
                    message: response.message
                })
            }
        }
    },
    created(){
        this.hasDailySummary()
    }
}
</script>

<style>
.import-panel-wrapper {
    margin-top: -15px;
}
.import-panel-wrapper .is-customed {
    color: #409eff;
}
</style>