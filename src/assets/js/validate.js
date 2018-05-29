import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'

import zh from 'vee-validate/dist/locale/zh_CN'
Validator.addLocale(zh)
Vue.use(VeeValidate, {locale: 'zh_CN'})

// 自定义validate
const dictionary = {
    zh_CN: {
      messages: {
        required: field => field + '不能为空.'
      },
      attributes:{
        username: '用户名',
        password: '密码',
        deptname: '部门名称',
        account: '帐号',
        phone: '手机号',
        email: '邮箱',
        postname: '职务名称',
        storename: '门店名称',
        gdtypename: '商品分类名称',
        gdtypecode: '商品分类编码',
        stufftypename: '原材料分类名称',
        stufftypecode: '原材料分类编码',
        unitname: '单位名称',
        goodsname: '商品名称',
        goodsprice: '商品定价',
        materialname: '原材料名称',
        purchaseprice: '采购价',
        balanceprice: '默认结算价',
        yieldrate: '出成率',
        depotname: '仓库名称'
      }
   }
}
 
Validator.updateDictionary(dictionary)

Validator.extend('spechar', {
    messages: {
      zh_CN: field => field + '不能是特殊字符.'
    },
    validate: value => {
      return /^[^`~!@#\$%\^\&\*\(\)_\+<>\?:\{\},\.\\\/;'\[\]]+$/.test(value)
    }
})

Validator.extend('phone', {
    messages: {
      zh_CN: field => field + '必须是11位号码.'
    },
    validate: value => {
      return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
})