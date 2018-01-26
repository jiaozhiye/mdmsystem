<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所属分类</label>
        <div class="app-input-block">
            <el-select v-model="form.superGdtypeId" disabled placeholder="请选所属商品分类">
                <el-option v-for="(item, key) in superGdtypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>分类名称</label>
        <div class="app-input-block">
            <el-input name="gdtypename" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('gdtypename')}" clearable placeholder="请输入部门名称..." ></el-input>
            <span v-if="errors.has('gdtypename')" class="prompt-title">{{ errors.first('gdtypename') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>分类编码</label>
        <div class="app-input-block">
            <el-input name="gdtypecode" v-model="form.code" v-validate="'required'" :class="{'formDanger': errors.has('gdtypecode')}" clearable placeholder="请输入商品分类编码..." ></el-input>
            <span v-if="errors.has('gdtypecode')" class="prompt-title">{{ errors.first('gdtypecode') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">分类描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入商品分类描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getFirGdtypeInfo, getGdtypeRecord, updateGdtypeRecord} from 'api'

export default {
    name: 'ModGoodsTypePanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            superGdtypeList: [],
            form: {
                superGdtypeId: '',
                name: '',
                code: '',
                desc: ''
            }
        }
    },
    created(){
        this.getItemInfo()
        this.getFirstGdtypeList()
    },
    methods: {
        async getItemInfo(){
            try {
                const response = await getGdtypeRecord({id: this.itemId})
                console.log(response.data)
                if (response.data.code == 1){
                    this.form.superGdtypeId = response.data.data.parent_id == '0' ? '' : response.data.data.parent_id
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
        async getFirstGdtypeList(){
            try {
                const response = await getFirGdtypeInfo()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.superGdtypeList = response.data.data
                }
            } catch (err){
                console.error(err)
            }
        },
        submitHandle(){
            this.updateGdtypeInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateGdtypeInfo(callback){
            try {
                const response = await updateGdtypeRecord({
                    id: this.itemId,
                    parent_id: this.form.superGdtypeId,
                    name: this.form.name,
                    code: this.form.code,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '修改商品分类成功!'
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