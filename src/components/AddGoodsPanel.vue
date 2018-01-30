<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所属分类</label>
        <div class="app-input-block">
            <el-select v-model="form.gdtypeId" placeholder="请选择上商品分类">
                <el-option v-for="(item, key) in gdtypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>商品名称</label>
        <div class="app-input-block">
            <el-input name="goodsname" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('goodsname')}" clearable placeholder="请输入商品名称..." ></el-input>
            <span v-if="errors.has('goodsname')" class="prompt-title">{{ errors.first('goodsname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">商品描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入商品描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getGdtypeTree, saveGoodsInfo} from 'api'

export default {
    name: 'AddGoodsPanel',
    props: {
        params: Object
    },
    data(){
        return {
            gdtypeList: [],
            form: {
                gdtypeId: '',
                name: '',
                desc: ''
            }
        }
    },
    methods: {
        async getGdtypeList(){
            try {
                const response = await getGdtypeTree()
                this.gdtypeList = response.data
            } catch (error){
                console.error(error)
            }
        },
        submitHandle(){  
            this.insertGoodsInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertGoodsInfo(callback){
            if (this.form.gdtypeId == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写商品信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveGoodsInfo({
                    type: this.form.gdtypeId,
                    name: this.form.name,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '商品添加成功!'
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
        this.getGdtypeList()
    }
}
</script>

<style>
</style>