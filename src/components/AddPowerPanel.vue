<template>
<div class="app-form-panel power-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>职务名称</label>
        <div class="app-input-block">
            <el-input name="postname" v-model="form.title" v-validate="'required|spechar'" :class="{'formDanger': errors.has('postname')}" clearable placeholder="请输入职务名称..." ></el-input>
            <span v-if="errors.has('postname')" class="prompt-title">{{ errors.first('postname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">职务描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入职务描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label power-setting"><i class="icon el-icon-edit-outline"></i> 权限设置</label>
        <div class="app-input-block">
            <h4 style="color: #909399">选中分类才会拥有操作权限</h4>
            <el-tree
                :data="list"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                @check-change="getCheckedKeys" >
            </el-tree>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {savePowerRecord, getPowerList} from 'api'

export default {
    name: 'AddPowerPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [],
            form: {
                title: '',
                desc: ''
            },
            checkedKeys: [] // 树结构选中的ID数组
        }
    },
    created(){
        this.getPowerList()
    },
    watch: {
        checkedKeys(newVal, oldVal){
            console.log(newVal.join(), oldVal.join())
            if (newVal.join() !== oldVal.join()){
                
            }
        }
    },
    methods: {
        async getPowerList(){
            try {
                const response = await getPowerList()
                console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        getCheckedKeys(){
            this.checkedKeys = this.$refs.tree.getCheckedKeys()
        },
        submitHandle(){
            this.insertDataInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertDataInfo(callback){
            if (this.form.title == ''){
                return this.$message({
                    message: '请正确填写职务名称再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await savePowerRecord({
                    name: this.form.title,
                    desc: this.form.desc,
                    list: this.list
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '职务添加成功!'
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
.power-setting .icon {
    font-size: 16px;
    color: #409eff;
}
</style>