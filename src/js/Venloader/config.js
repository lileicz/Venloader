/**
 * config
 * 配置根路径，别名，调试/非调试模式
 */
(function(ns){
	var config = ns.config = {},util=ns.util;
	
	//配置是否为调试模式
	config.debug = false;
	
	/**
	 * 配置字符编码
	 */
	config.charset = 'utf-8';
	
	/**
	 * 配置文件的根路径
	 * path = ns.config.base + '/' + id
	 */
    // Async inserted script
    var loaderScript = document.getElementById('seajsnode')

    // Static script
    if (!loaderScript) {
        var scripts = document.getElementsByTagName('script')
        loaderScript = scripts[scripts.length - 1]
    }

    var loaderSrc = (loaderScript && util.getScriptAbsoluteSrc(loaderScript)) ||
        util.pageUri // When sea.js is inline, set base to pageUri.

    var base = util.dirname(getLoaderActualSrc(loaderSrc))
    util.loaderDir = base

    // When src is "http://test.com/libs/seajs/1.0.0/sea.js", redirect base
    // to "http://test.com/libs/"
    var match = base.match(/^(.+\/)seajs\/[\.\d]+(?:-dev)?\/$/)
    if (match) base = match[1]
	config.base = base;
	
	/*
	 * 配置路径别名
	 * config.alias.jquery = 'http://www.baidu.com/js/jquery'
	 * ns.use('jquery',function($){
	 * 	$(...);
	 * })
	 */
	config.alias = {};
	
	/**
	 * 默认加载
	 */
	config.preload = [];
    function getLoaderActualSrc(src) {
        if (src.indexOf('??') === -1) {
            return src
        }

        // Such as: http://cdn.com/??seajs/1.2.0/sea.js,jquery/1.7.2/jquery.js
        // Only support nginx combo style rule. If you use other combo rule, please
        // explicitly config the base path and the alias for plugins.
        var parts = src.split('??')
        var root = parts[0]
        var paths = util.filter(parts[1].split(','), function(str) {
            return str.indexOf('sea.js') !== -1
        })

        return root + paths[0]
    }
})(amkit);