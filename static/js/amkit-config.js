/**
 * @file amkit-config.js
 * @data 2012-9-12
 * @desc amkit配置文件
 * config.debug
 * config.base 
 * config.alias 别名
 * config.preload 预加载
 */
(function(ns){
	var config = ns.config;
	config.debug = true;
	config.base = (function(){
		var base = location.href.split('demo/')[0];
		return base||'/';
	})();
	config.alias = {
			'jquery' : 'static/js/jquery',
			'devtool' : 'static/js/devtool/devtool'
	};
	config.preload = config.debug?['jquery','devtool']:['jquery'];
})(amkit);