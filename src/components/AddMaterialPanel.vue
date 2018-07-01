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
            <el-input name="materialname" v-model="form.name" v-validate="'required'" :class="{'formDanger': errors.has('materialname')}" clearable placeholder="请输入原材料名称" ></el-input>
            <span v-if="errors.has('materialname')" class="prompt-title">{{ errors.first('materialname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">原材料编号</label>
        <div class="app-input-block">
            <el-input v-model="form.code" clearable placeholder="请输入原材料编号" ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>计量单位</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.calcNum" style="width: 200px"></el-input>
            <el-select v-model="form.calc_unit_1" placeholder="单位" style="width: 80px;" @change="changeHandle">
                <el-option v-for="(val, key) in unitList" :key="key" :label="val" :value="val"></el-option>
            </el-select>
            <em class="slant-line">/</em>
            <el-select v-model="form.calc_unit_2" :disabled="unitDisabled" clearable placeholder="单位" style="width: 80px;" @change="changeHandle">
                <el-option v-for="(val, key) in unitList" :key="key" :label="val" :value="val"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">装箱单位</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.packNum" style="width: 200px"></el-input>
            <el-input v-model="form.calc_unit_2" style="width: 80px" disabled></el-input>
            <em class="slant-line">/</em>
            <el-select v-model="form.pack_unit" :disabled="unitDisabled" clearable placeholder="单位" style="width: 80px;" @change="changeHandle">
                <el-option v-for="(val, key) in unitList" :key="key" :label="val" :value="val"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>提货单位</label>
        <div class="app-input-block">
            <el-select v-model="form.take_unit" :disabled="unitDisabled" placeholder="单位" style="width: 80px;">
                <el-option v-for="(val, key) in variableUnitList" :key="key" :label="val" :value="val"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">保质期</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.quality_time" placeholder="请输入保质期天数" >
                <template slot="append">天</template>
            </el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">存储条件</label>
        <div class="app-input-block">
            <el-select v-model="form.storeConditionId" clearable placeholder="请选择存储条件">
                <el-option v-for="(item, key) in storeConditionList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">到货周期</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.arrival_time" placeholder="请输入到货周期天数" >
                <template slot="append">天</template>
            </el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">订单类型</label>
        <div class="app-input-block">
            <el-select v-model="form.orderTypeId" clearable placeholder="请选择订单类型">
                <el-option v-for="(item, key) in orderTypeList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">库存类型</label>
        <div class="app-input-block">
            <el-select v-model="form.reptypeId" clearable placeholder="请选择库存类型">
                <el-option v-for="(item, key) in repTypeList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>出成率</label>
        <div class="app-input-block">
            <el-input name="yieldrate" v-model="form.yield_rate" v-validate="'required|decimal:5'" :class="{'formDanger': errors.has('yieldrate')}" clearable placeholder="请输入出成率" >
                <template slot="append">%</template>
            </el-input>
            <span v-if="errors.has('yieldrate')" class="prompt-title">{{ errors.first('yieldrate') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>采购(成本)价</label>
        <div class="app-input-block">
            <el-input name="purchaseprice" v-model="form.purchase_price" v-validate="'required|decimal:2'" :class="{'formDanger': errors.has('purchaseprice')}"  clearable placeholder="请输入采购价" ></el-input>
            <span v-if="errors.has('purchaseprice')" class="prompt-title">{{ errors.first('purchaseprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>默认结算价</label>
        <div class="app-input-block">
            <el-input name="balanceprice" v-model="form.balance_price" v-validate="'required|decimal:2'" :class="{'formDanger': errors.has('balanceprice')}"  clearable placeholder="请输入默认结算价" ></el-input>
            <span v-if="errors.has('balanceprice')" class="prompt-title">{{ errors.first('balanceprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>餐厅价</label>
        <div class="app-input-block">
            <el-input name="storeprice" v-model="form.out_price" v-validate="'required|decimal:2'" :class="{'formDanger': errors.has('storeprice')}"  clearable placeholder="请输入餐厅价" ></el-input>
            <span v-if="errors.has('storeprice')" class="prompt-title">{{ errors.first('storeprice') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">规格/型号</label>
        <div class="app-input-block">
            <el-input v-model="form.spec" placeholder="请输入原材料规格、型号" clearable></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">尺寸大小</label>
        <div class="app-input-block">
            <el-input v-model="form.size" placeholder="请输入原材料尺寸" clearable></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">品牌</label>
        <div class="app-input-block">
            <el-input v-model="form.brand" placeholder="请输入原材料品牌" clearable></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">原材料排序</label>
        <div class="app-input-block">
            <el-input type="number" v-model="form.sort" placeholder="请输入原材料排序" ></el-input>
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
        <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">确定</el-button>
    </div>
</div>
</template>

<script>
import {getMaterialSelTree, getStuffToryList, getMaterialUnitInfo, getOrderTypeInfo, getStoreConditionInfo, saveMaterialInfo} from 'api'
import { mapState } from 'vuex'

export default {
    name: 'AddMaterialPanel',
    props: {
        params: Object,
        classid: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            stufftypeList: [], // 原材料分类数组
            repTypeList: [], // 库存类型列表
            orderTypeList: [], // 订单类型数组
            storeConditionList: [], // 存储条件数组
            unitList: [], // 单位数组
            variableUnitList: [], // 可变的单位数组
            unitDisabled: true, // 单位的可操作状态    true - 禁用
            form: {
                stufftypeId: this.classid,
                name: '',
                code: '',
                calcNum: '', // 计量单位的数值
                calc_unit_1: '', // 计量单位 - 前
                calc_unit_2: '', // 计量单位 - 后
                packNum: '', // 装箱单位的数值
                pack_unit: '', // 装箱单位
                take_unit: '', // 提货单位
                quality_time: '', // 保质期
                arrival_time: '', // 到货周期
                storeConditionId: '', // 存储条件
                orderTypeId: '', // 订单类型
                reptypeId: '',
                yield_rate: '100',
                purchase_price: '',
                balance_price: '',
                out_price: '', // 餐厅价
                spec: '', // 规格型号
                size: '', // 尺寸
                brand: '', // 品牌
                sort: '1000',
                desc: ''
            }
        }
    },
    watch: {
        classid(val){
            this.form.stufftypeId = val
        }
    },
    computed: {
        ...mapState(['btnLoading'])
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
        async getMaterialUnitList(){
            try {
                const response = await getMaterialUnitInfo()
                if (response.data.code == 1){
                    this.unitList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getOrderTypeList(){
            try {
                const response = await getOrderTypeInfo()
                if (response.data.code == 1){
                    this.orderTypeList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStoreConditionList(){
            try {
                const response = await getStoreConditionInfo()
                if (response.data.code == 1){
                    this.storeConditionList = response.data.list
                }
            } catch (error){
                console.error(error)
            }
        },
        changeHandle(item){
            this.unitDisabled && (this.unitDisabled = !1)
            let _arr = []
            this.form.calc_unit_1 !== '' ? _arr.push(this.form.calc_unit_1) : ''
            this.form.calc_unit_2 !== '' ? _arr.push(this.form.calc_unit_2) : ''
            this.form.pack_unit !== '' ? _arr.push(this.form.pack_unit) : ''
            this.variableUnitList = [...new Set(_arr)]
            if (this.variableUnitList.indexOf(this.form.take_unit) === -1){
                this.form.take_unit = this.variableUnitList[0] ? this.variableUnitList[0] : ''
            }
        },
        submitHandle(){
            this.insertMaterialInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertMaterialInfo(callback){
            if (this.form.stufftypeId == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写原材料信息再提交！',
                    type: 'warning'
                })
            }
            try {
                const response = await saveMaterialInfo({
                    type: this.form.stufftypeId,
                    name: this.form.name,
                    code: this.form.code,
                    wm_type: this.form.reptypeId,
                    yield_rate: this.form.yield_rate,
                    purchase_price: this.form.purchase_price,
                    balance_price: this.form.balance_price,
                    out_price: this.form.out_price,
                    sort: this.form.sort,
                    desc: this.form.desc,
                    unit_num: this.form.calcNum, // 计量单位的数值
                    unit: this.form.calc_unit_1, // 计量单位 - 前
                    unit_big: this.form.calc_unit_2, // 计量单位 - 后
                    box_attr_num: this.form.packNum, // 装箱单位的数值
                    box_attr: this.form.pack_unit, // 装箱单位
                    out_unit: this.form.take_unit, // 提货单位
                    shelf_life_num: this.form.quality_time, // 保质期
                    security_time: this.form.arrival_time, // 到货周期
                    storage_condition: this.form.storeConditionId, // 存储条件
                    order_type: this.form.orderTypeId, // 订单类型
                    model: this.form.spec, // 规格型号
                    size: this.form.size, // 尺寸
                    brand: this.form.brand // 品牌
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '原材料添加成功!'
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
        this.getStufftypeList()
        this.getStoryList()
        this.getMaterialUnitList()
        this.getOrderTypeList()
        this.getStoreConditionList()
    }
}
</script>

<style>
.app-form-item .slant-line {
    display: inline-block;
    color: #999;
    transform: scale(1.2, 1.8);
    padding: 0 5px;
}
</style>