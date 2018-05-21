<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所属分类</label>
        <div class="app-input-block">
            <el-select v-model="form.stufftypeId" clearable placeholder="请选择原材料分类">
                <el-option v-for="(item, key) in stufftypeList" 
                    :key="key" 
                    :label="item.name" 
                    :value="item.id"
                    :disabled="item.disabled">
                </el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>原材料名称</label>
        <div class="app-input-block">
            <el-input name="materialname" v-model="form.name" v-validate="'required'" :class="{'formDanger': errors.has('materialname')}" clearable placeholder="请输入原材料名称..." ></el-input>
            <span v-if="errors.has('materialname')" class="prompt-title">{{ errors.first('materialname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">原材料编号</label>
        <div class="app-input-block">
            <el-input disabled v-model="form.code" clearable placeholder="请输入原材料编号..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>库存类型</label>
        <div class="app-input-block">
            <el-select v-model="form.reptypeId" disabled clearable placeholder="请选择库存类型">
                <el-option v-for="(item, key) in repTypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>出成率</label>
        <div class="app-input-block">
            <el-input name="yieldrate" v-model="form.yield_rate" v-validate="'required|decimal:5'" :class="{'formDanger': errors.has('yieldrate')}" clearable placeholder="请输入出成率..." >
                <template slot="append">%</template>
            </el-input>
            <span v-if="errors.has('yieldrate')" class="prompt-title">{{ errors.first('yieldrate') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>单位</label>
        <div class="app-input-block">
            <el-select v-model="form.unitId" disabled clearable placeholder="请选商品单位">
                <el-option v-for="(item, key) in unitList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>采购(成本)价</label>
        <div class="app-input-block">
            <el-input name="purchaseprice" v-model="form.purchase_price" v-validate="'required|decimal:5'" :class="{'formDanger': errors.has('purchaseprice')}"  clearable placeholder="请输入采购价..." ></el-input>
            <span v-if="errors.has('purchaseprice')" class="prompt-title">{{ errors.first('purchaseprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>默认结算价</label>
        <div class="app-input-block">
            <el-input name="balanceprice" v-model="form.balance_price" v-validate="'required|decimal:5'" :class="{'formDanger': errors.has('balanceprice')}"  clearable placeholder="请输入默认结算价..." ></el-input>
            <span v-if="errors.has('balanceprice')" class="prompt-title">{{ errors.first('balanceprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">原材料排序</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.sort" placeholder="请输入原材料排序..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">原材料描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入原材料描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {getMaterialRecord, getMaterialSelTree, getStuffToryList, getUnitList, updateMaterialRecord} from 'api'

export default {
    name: 'ModMaterialPanel',
    props: {
        params: Object,
        classid: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            itemId: this.params.itemId,
            stufftypeList: [],
            repTypeList: [], // 库存类型列表
            unitList: [],
            form: {
                stufftypeId: this.classid,
                name: '',
                code: '',
                reptypeId: '',
                yield_rate: '',
                unitId: '',
                purchase_price: '',
                balance_price: '',
                sort: '',
                desc: ''
            }
        }
    },
    watch: {
        classid(val){
            this.form.stufftypeId = val
        }
    },
    methods: {
        async getStufftypeList(){
            try {
                const response = await getMaterialSelTree()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.stufftypeList = response.data.list
                    this.stufftypeList.forEach(item => {
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
                const response = await getStuffToryList({type: 'query'})
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
        async getItemInfo(){
            try {
                const response = await getMaterialRecord({id: this.itemId})
                // console.log(response.data)
                if (response.data.code == 1){
                    this.form.stufftypeId = response.data.data.type_2 || ''
                    this.form.name = response.data.data.name || ''
                    this.form.code = response.data.data.code
                    this.form.reptypeId = response.data.data.wm_type
                    this.form.yield_rate = response.data.data.yield_rate
                    this.form.unitId = response.data.data.unit
                    this.form.purchase_price = response.data.data.purchase_price
                    this.form.balance_price = response.data.data.balance_price
                    this.form.sort = response.data.data.sort
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
        submitHandle(){
            this.updateMaterialInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async updateMaterialInfo(callback){
            if (this.form.stufftypeId == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写原材料信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await updateMaterialRecord({
                    id: this.itemId,
                    type: this.form.stufftypeId,
                    name: this.form.name,
                    code: this.form.code,
                    wm_type: this.form.reptypeId,
                    yield_rate: this.form.yield_rate,
                    unit: this.form.unitId,
                    purchase_price: this.form.purchase_price,
                    balance_price: this.form.balance_price,
                    sort: this.form.sort,
                    desc: this.form.desc
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '原材料修改成功!'
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
        this.getStufftypeList()
        this.getStoryList()
        this.getUnitList()
    }
}
</script>

<style>
</style>