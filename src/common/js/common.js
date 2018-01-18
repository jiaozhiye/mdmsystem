export default (function (env){
	if (env == 'production'){
		window.console.log = window.console.warn = window.console.error = function(){}
		window.serverUrl = 'http://123.57.140.115:2080/'
		return '当前工程环境：production'
	} else if (env == 'development'){
		window.serverUrl = 'http://127.0.0.1:2080/api'
		return '当前工程环境：development'
	} else {
		return '请配置工程环境~~~'
	}
})('development')