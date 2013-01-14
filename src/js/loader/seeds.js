
/**
 * @example
 * 标准：主要用于多个模块合并处理
 * ns.add([],function(){}).alias('/static/xxx');
 */
/**
 * @example
 * 简洁：
 * ns.add([],function(){})
 */
if(typeof(vloader)=='undefined'){
	vloader = function(){
		var args = vloader.util.makeArray(arguments);
		return arguments.callee.use.apply(this,args);
	};
    window.VL=vloader;
}
