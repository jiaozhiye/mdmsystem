export default (function (env){
	if (env == 'production'){
		window.console.log = window.console.warn = window.console.error = function(){}
		window.serverUrl = 'http://123.57.140.115:2080/'
		return '当前工程环境：production'
	} else if (env == 'development'){
		window.serverUrl = 'http://192.168.1.163:8081'
		return '当前工程环境：development'
	} else {
		return '请配置工程环境~~~'
	}
})('development')