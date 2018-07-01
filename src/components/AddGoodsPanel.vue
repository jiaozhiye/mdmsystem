<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所属分类</label>
        <div class="app-input-block">
            <el-select v-model="form.gdtypeId" clearable placeholder="请选择商品分类">
                <el-option v-for="(item, key) in gdtypeList" 
                    :key="key" 
                    :label="item.name" 
                    :value="item.id"
                    :disabled="item.disabled"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>商品名称</label>
        <div class="app-input-block">
            <el-input name="goodsname" v-model="form.name" v-validate="'required'" :class="{'formDanger': errors.has('goodsname')}" clearable placeholder="请输入商品名称..." ></el-input>
            <span v-if="errors.has('goodsname')" class="prompt-title">{{ errors.first('goodsname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">商品编号</label>
        <div class="app-input-block">
            <el-input v-model="form.code" clearable placeholder="请输入商品编号..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>库存类型</label>
        <div class="app-input-block">
            <el-select v-model="form.reptypeId" clearable placeholder="请选择库存类型">
                <el-option v-for="(item, key) in repTypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>单位</label>
        <div class="app-input-block">
            <el-select v-model="form.unitId" clearable placeholder="请选择商品单位">
                <el-option v-for="(item, key) in unitList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>商品定价</label>
        <div class="app-input-block">
            <el-input name="goodsprice" v-model="form.price" v-validate="'required|decimal:2'" :class="{'formDanger': errors.has('goodsprice')}"  clearable placeholder="请输入商品价格..." ></el-input>
            <span v-if="errors.has('goodsprice')" class="prompt-title">{{ errors.first('goodsprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>成本价</label>
        <div class="app-input-block">
            <el-input name="costprice" v-model="form.cost_price" v-validate="'required|decimal:2'" :class="{'formDanger': errors.has('costprice')}"  clearable placeholder="请输入成本价格..." ></el-input>
            <span v-if="errors.has('costprice')" class="prompt-title">{{ errors.first('costprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">商品状态</label>
        <div class="app-input-block">
            <el-radio v-model="form.state" label="1">启用</el-radio>
            <el-radio v-model="form.state" label="0">停用</el-radio>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">商品排序</label>
        <div class="app-input-block">
            <el-input v-model="form.sort" clearable placeholder="请输入商品排序..." ></el-input>
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
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {getGdtypeTree, getInventoryList, getUnitList, saveGoodsInfo} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'AddGoodsPanel',
    props: {
        params: Object
    },
    data(){
        return {
            gdtypeList: [],
            repTypeList: [], // 库存类型列表
            unitList: [],
            form: {
                gdtypeId: '',
                name: '',
                code: '',
                reptypeId: '',
                unitId: '',
                price: '',
                cost_price: '', // 成本价
                state: '1',
                sort: '1000',
                desc: ''
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getGdtypeList(){
            try {
                const response = await getGdtypeTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.gdtypeList = response.data.list
                    this.gdtypeList.forEach(item => {
                        if (item.parent_id === '0'){
                            item.disabled = true
                        }
                    })
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStoryList(){
            try {
                const response = await getInventoryList()
                if (response.data.code == 1){
                    this.repTypeList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getUnitList(){
            try {
                const response = await getUnitList()
                if (response.data.code == 1){
                    this.unitList = response.data.list
                }
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
                    code: this.form.code,
                    wm_type: this.form.reptypeId,
                    unit: this.form.unitId,
                    price: this.form.price,
                    cost_price: this.form.cost_price,
                    state: this.form.state,
                    sort: this.form.sort,
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
        this.getStoryList()
        this.getUnitList()
    }
}
</script>

<style>
</style>