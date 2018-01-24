export default (function (env){
	let envObj = {
		env: '请配置工程环境~~~',
		serverUrl: ''
	}
	if (env == 'production'){
		// 使控制台 console 输出失效
		window.console.log = function(){}
		envObj.env = '当前工程环境：production'
		envObj.serverUrl = 'http://123.57.140.115:2080'
	} else if (env == 'development'){
		envObj.env = '当前工程环境：development'
		envObj.serverUrl = 'http://192.168.1.163:8081'
	}
	return envObj
})('development')