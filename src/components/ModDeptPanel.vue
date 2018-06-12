<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>上级部门</label>
        <div class="app-input-block">
            <el-select v-model="superdeptId" clearable placeholder="请选择上级部门">
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
    <div class="app-form-item app-form-text">
        <label class="app-form-label">部门描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="deptdesc" placeholder="请输入部门描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {getDeptInfo, getDeptRecord, updateDeptRecord} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'ModDeptPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            superdeptList: [],
            superdeptId: '',
            dept: '',
            deptdesc: ''
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getDeptRecord({id: this.itemId})
                if (response.data.code == 1){
                    this.superdeptId = response.data.data.parent_id == '0' ? '' : response.data.data.parent_id
                    this.dept = response.data.data.name
                    this.deptdesc = response.data.data.descr || ''
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
        async getDeptList(){
            try {
                const response = await getDeptInfo()
                if (response.data.code == 1){
                    this.superdeptList = response.data.list
                }
            } catch (err){
                console.error(err)
            }
        },
        submitHandle(){
            this.updateDeptInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateDeptInfo(callback){
            try {
                const response = await updateDeptRecord({
                    id: this.itemId,
                    parent_id: this.superdeptId,
                    name: this.dept,
                    descr: this.deptdesc
                })
                if (response.data.id){
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
        this.getDeptList()
    }
}
</script>

<style>
</style>