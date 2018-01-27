<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所属分类</label>
        <div class="app-input-block">
            <el-select v-model="form.superStuffTypeId" disabled placeholder="请选所属原材料分类">
                <el-option v-for="(item, key) in superStuffTypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>分类名称</label>
        <div class="app-input-block">
            <el-input name="stufftypename" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('stufftypename')}" clearable placeholder="请输入原材料分类名称..." ></el-input>
            <span v-if="errors.has('stufftypename')" class="prompt-title">{{ errors.first('stufftypename') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>分类编码</label>
        <div class="app-input-block">
            <el-input name="stufftypecode" v-model="form.code" v-validate="'required'" :class="{'formDanger': errors.has('stufftypecode')}" clearable placeholder="请输入原材料分类编码..." ></el-input>
            <span v-if="errors.has('stufftypecode')" class="prompt-title">{{ errors.first('stufftypecode') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">分类描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入原材料分类描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getFirStuffTypeInfo, getStuffTypeRecord, updateStuffTypeRecord} from 'api'

export default {
    name: 'ModStuffTypePanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            superStuffTypeList: [],
            form: {
                superStuffTypeId: '',
                name: '',
                code: '',
                desc: ''
            }
        }
    },
    created(){
        this.getItemInfo()
        this.getFirstStuffTypeList()
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getStuffTypeRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.superStuffTypeId = response.data.data.parent_id == '0' ? '' : response.data.data.parent_id
                    this.form.name = response.data.data.name || ''
                    this.form.code = response.data.data.code
                    this.form.desc = response.data.data.desc
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
        async getFirstStuffTypeList(){
            try {
                const response = await getFirStuffTypeInfo()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.superStuffTypeList = response.data.data
                }
            } catch (err){
                console.error(err)
            }
        },
        submitHandle(){
            this.updateStuffTypeInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateStuffTypeInfo(callback){
            try {
                const response = await updateStuffTypeRecord({
                    id: this.itemId,
                    parent_id: this.form.superStuffTypeId,
                    name: this.form.name,
                    code: this.form.code,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '修改原材料分类成功!'
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