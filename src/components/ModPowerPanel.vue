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
            <h4 style="color: #909399">提示：勾选分类才会拥有操作权限</h4>
            <el-tree
                ref="tree"
                :data="list"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="checkedKeys"
                @check-change="getCheckedKeys">
            </el-tree>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {getPowerRecord, updatePowerRecord} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'ModPowerPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            list: [],
            form: {
                title: '',
                desc: ''
            },
            checkedKeys: [] // 树结构选中的ID数组
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getPowerRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.title = response.data.job.name
                    this.form.desc = response.data.job.desc
                    this.list = response.data.tree
                    this.checkedKeys = response.data.menuList
                }
            } catch (error){
                console.error(error)
            }
        },
        getCheckedKeys(){
            this.checkedKeys = this.$refs.tree.getCheckedKeys()
        },
        submitHandle(){   
            this.updatePowerInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updatePowerInfo(callback){
            try {
                const response = await updatePowerRecord({
                    id: this.itemId,
                    name: this.form.title,
                    desc: this.form.desc,
                    menuIds: this.checkedKeys.join(',')
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '职务修改成功!'
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
        this.getItemInfo()
    }
}
</script>

<style>
.power-setting .icon {
    font-size: 16px;
    color: #409eff;
}
</style>