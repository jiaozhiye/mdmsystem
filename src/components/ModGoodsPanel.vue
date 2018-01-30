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
import {getGdtypeTree, getGoodsRecord, updateGoodsRecord} from 'api'

export default {
    name: 'ModGoodsPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                gdtypeId: '',
                name: '',
                desc: ''
            }
        }
    },
    created(){
        this.getGdtypeList()
        this.getItemInfo()
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
        async getItemInfo(){
            try {
                const response = await getGoodsRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.gdtypeId = response.data.data.type
                    this.form.name = response.data.data.name || ''
                    this.form.desc = response.data.data.desc || ''
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
        submitHandle(){
            this.updateGoodsInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateGoodsInfo(callback){
            try {
                const response = await updateGoodsRecord({
                    id: this.itemId,
                    type: this.form.gdtypeId,
                    name: this.form.name,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '修改商品成功!'
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