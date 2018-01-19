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
        password: '密码'
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