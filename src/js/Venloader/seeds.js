
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
if(typeof(amkit)=='undefined'){
	amkit = function(){
		var args = amkit.util.makeArray(arguments);
		return arguments.callee.use.apply(this,args);
	};
}
