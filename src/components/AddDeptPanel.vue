<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>上级部门</label>
        <div class="app-input-block">
            <el-select v-model="superdeptId" placeholder="请选择上级部门">
                <el-option v-for="(item, key) in superdeptList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>部门名称</label>
        <div class="app-input-block">
            <el-input name="deptname" v-model="dept" v-validate="'required|spechar'" :class="{'formDanger': errors.has('deptname')}" clearable placeholder="请输入部门名称..." ></el-input>
            <span v-if="errors.has('deptname')" class="prompt-title">{{ errors.first('deptname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">部门描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="deptdesc" placeholder="请输入部门描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getDeptInfo, saveDeptInfo} from 'api'

export default {
    name: 'AddDeptPanel',
    props: {
        params: Object
    },
    data(){
        return {
            superdeptList: [],
            superdeptId: '',
            dept: '',
            deptdesc: ''
        }
    },
    created(){
        this.getDeptList()
    },
    methods: {
        async getDeptList(){
            try {
                const response = await getDeptInfo()
                this.superdeptList = response.data
            } catch (err){
                console.error(err)
            }
        },
        submitHandle(){  
            this.insertDeptInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertDeptInfo(callback){
            if (this.superdeptId == '' || this.dept == ''){
                return this.$message({
                    message: '请正确填写部门信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveDeptInfo({
                    parent_id: this.superdeptId,
                    name: this.dept,
                    descr: this.deptdesc
                })
                if (response.data.id){
                    this.$message({
                        type: 'success',
                        message: '添加部门成功!'
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