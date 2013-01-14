VL.add(['jquery'],function(){
	var devtool = {};
	(function(ns){
		/**
		 * 应用工具
		 * @singleton
		 */
		ns.util = (function(){
			var format = /(\d{4})-(\d{2})-(\d{2}) (\d{2})\:(\d{2})\:(\d{2})/;
			var radix = 10;
			var int_format = /^(0|[1-9]\d*)$/;
			var number_format = /^(0|[1-9]\d*)$|^(0|[1-9]\d*)\.(\d+)$/;
			var number_format_2b = /^(0|[1-9]\d*)$|^(0|[1-9]\d*)\.(\d{1,2})$/;
			var httpUrl = /^(http:\/\/).*/;
			var toString = Object.prototype.toString;
			
			return {
				
				/**
				 * 获得window.location.href的值，不包含hash值
				 */
				getWindowURLExcludeHash : function(){
					var ap = location.href.indexOf('#');
					return ap == -1 ? location.href : location.href.substring(0,ap);
				},
				
				/**
				* 获得URL查询字符串键值对象
				* @return {Object} || {String}
				*/
				getUrlParma : function(name){
					var args = {};
					var query = location.search.substring(1);
					var pairs = query.split("&");
					
					for(var i = 0; i < pairs.length; i++) {
						var pos = pairs[i].indexOf('=');
						if (pos == -1) continue;
						var argname = pairs[i].substring(0,pos);
						var value = pairs[i].substring(pos+1);
						value = decodeURIComponent(value);
						args[argname] = value;
					}
					
					if(!name){
						return args;
					}else{
						return args[name]||'';
					}
				},
				
				/**
				* 获得URL不包含hash部分
				* http://www.xxx.com/v?z=x&c=x&at=5#tid=1
				* http://www.xxx.com/v?z=x&c=x&at=5#
				* @return {String} http://www.xxx.com/v?z=x&c=x&at=5
				*/
				getURLExcludeHash : function(){
					var ap = location.href.indexOf('#');
					return ap == -1 ? location.href : location.href.substring(0,ap);
				},
				/**
				* 获得URL的hash值
				* 如 http://www.xxx.com/v?z=x&c=x&at=5#tid=1
				* @return {Object}
				*/
				getHashValue : function(name,hash){
					var rt = {};
					return rt;
				},
				
				/**
				 * COPY功能
				 * @param {String} content 要复制的内容
				 * @param {Object} obj.success 成功后显示的信息，obj.failure 失败后显示的信息
				 */
				copy : function(content,obj){
					var flag = false;
					try{
						flag = window.clipboardData.setData("Text",content);
					}catch(e){
					}
					try{
						if(flag){
							alert(obj.success);
						}else{
							alert(obj.failure);
						}
					}catch(e){
						
					}
				},
				
				/**
				 * 说明：获取页面上选中的文字
				 * 整理：http://www.codebit.cn/javascript/get-selection.html
				 */  
				getSelectedText : function() {
				    if (window.getSelection) {
				        // This technique is the most likely to be standardized.
				        // getSelection() returns a Selection object, which we do not document.
				        return window.getSelection().toString();
				    }
				    else if (document.getSelection) {
				        // This is an older, simpler technique that returns a string
				        return document.getSelection();
				    }
				    else if (document.selection) {
				        // This is the IE-specific technique.
				        // We do not document the IE selection property or TextRange objects.
				        return document.selection.createRange().text;
				    }
				},
				
				/**
				 * 说明：FireFox 下获取 input 或者 textarea 中选中的文字
				 * 整理：http://www.codebit.cn/javascript/get-selection.html
				 */  
				getTextFieldSelection : function(e) {
				    if (e.selectionStart != undefined && e.selectionEnd != undefined) {
				        var start = e.selectionStart;
				        var end = e.selectionEnd;
				        return e.value.substring(start, end);
				    }
				    else return "";  // Not supported on this browser
				},
				
				/**
				 * 解析特定字符串为日期对象
				 * @param {String} dateString 日期格式字符串。如: 2011-05-06 18:08:01
				 * @return {Date} 返回日期实例
				 */
				parseDate : function(dateString){
					var rt='';
					var t = dateString.match(format);
					if(t != null){
						var year = parseInt(t[1],radix);
						var month = parseInt(t[2],radix) - 1;
						var day = parseInt(t[3],radix);
						var hours = parseInt(t[4],radix);
						var minutes = parseInt(t[5],radix);
						var seconds = parseInt(t[6],radix);
						rt = new Date(year,month,day,hours,minutes,seconds,0);
					}
					return rt;
				},
				
				/**
				 * 格式化日期
				 * @param {Date} date
				 * @param {String} format
				 */
				formatDate : function(/*Date*/date,/*String*/format){
					if(date){
						if(!format){
							format = "yyyy-MM-dd hh:mm:ss";
						}
						var o = {
								"MM" : date.getMonth() + 1,
								"dd" : date.getDate(),
								"hh" : date.getHours(),
								"mm" : date.getMinutes(),
								"ss" : date.getSeconds(),
								"S"  : date.getMilliseconds()
						};
						
						if(/(yyyy)/.test(format)) {
						    format = format.replace(RegExp.$1, date.getFullYear());
						}
						
						for(var k in o){
							if(new RegExp("("+ k +")").test(format)) {
							    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
							}
						}
					}else{
						return "";
					}
					return format;
				},
				
				/**
				 * 格式化即时时间
				 * 59秒，
				 * 59分钟，
				 * 9天
				 * 2012-12-10 17:50:10
				 */
				formatBeforeDate : function(/*Date*/currentDate,/*Date*/date){
					var util = ns.util,
						dist = currentDate-(date-0),
						aSec = 1000,
						aMin = aSec*60,
						aHour = aMin*60,
						aDay = aHour * 24,
						aWeek = aDay * 7,
						rt = '';
					if(dist<=aSec){
						rt = '1秒前';
					}else if(dist<aMin){
						rt = Math.floor(dist/aSec) + '秒前';
					}else if(dist<aHour){
						rt = Math.floor(dist/aMin) + '分钟前';
					}else if(dist<aDay){
						rt = Math.floor(dist/aHour) + '小时前';
					}else if(dist<2*aDay){
						rt = '昨天';
					}else if(dist<aWeek){
						rt = Math.floor(dist/aDay) + '天前';
					}else{
						rt = util.formatDate(new Date(date),'yyyy-MM-dd');
					}
					return rt;
				},
				
				/**
				 * 把字符串替换成浏览器能识别的url格式
				 * @return string
				 */
				format2Url : function(str){
					if(ns.util.isUrl(str)){
						if(str.charCodeAt(0)==115){
							return 'http://'+str;
						}else{
							return str;
						}
					}else{
						return str;
					}
				},
				
				/**
				 * 计算字符串的长度，包括非ASCII字符
				 * @param {String} str 原始字符串
				 */
				strlen : function(str){
					if(!str){
						return 0;
					}
					var len = 0;  
				    for (var i = 0; i < str.length; i++) {  
				        if (str.charCodeAt(i) > 255) len += 2; else len ++;  
				    }  
				    return len;
				},
				
				/**
				 * 空判断
				 */
				isNull : function(/*String*/v){
					var rt = true;
					if(v){
						v = jQuery.trim(v);
						if(v.length > 0){
							rt = false;
						}
					}
					return rt;
				},
				
				/**
				 * 非数值判断
				 */
				isNaN : function(/*Number|String*/v){
					var rt = true;
					if(this.isNull(v) == false){
						if(number_format.test(v)){
							rt = false;
						}
					}
					return rt;
				},
				
				/**
				 * 非数值判断,2位小数
				 */
				isNaN2b : function(/*Number|String*/v){
					var rt = true;
					if(this.isNull(v) == false){
						if(number_format_2b.test(v)){
							rt = false;
						}
					}
					return rt;
				},
				
				/**
				 * 非整数判断
				 */
				isNaI : function(/*Number|String*/v){
					var rt = true;
					if(this.isNaN(v) == false){
						if(int_format.test(v)){
							rt = false;
						}
					}
					return rt;
				},
				
				/**
				 * 处理url为正确的格式
				 */
				httpUrl : function(/*String*/url){
					if(!httpUrl.test(url)){
						url = 'http://'+url;
					}
					return url;
				},
				
				/**
				 * 截取定长字符串，加上...
				 * @param {String} str
				 * @param {Number} len 英文字符长度
				 */
				substr : function(str, len){
					var str_length = 0; 
					var str_len = 0; 
					str_cut = ''; 
					str_len = str.length; 
					for(var i = 0; i < str_len; i++) { 
					    a = str.charAt(i); 
					    str_length++; 
					    if(escape(a).length > 4){ 
					        str_length++; 
					    } 
					    str_cut = str_cut.concat(a); 
					    if(str_length>=len){ 
					        str_cut = str_cut.concat("..."); 
					        return str_cut; 
					    } 
					} 
					if(str_length < len){ 
					    return  str; 
					} 
				},
				
				serialize : function(obj){
					if(undefined==obj){
						return "\"" + 'undefined' + "\"";
					}
				    switch(obj.constructor){
				        case Object:
				            var str = "{";
				            for(var o in obj){
				                str += "\"" + o + "\":" + this.serialize(obj[o]) +",";
				            }
				            if(str.substr(str.length-1) == ",")
				                str = str.substr(0,str.length -1);
				            return str + "}";
				            break;
				        case Array:            
				            var str = "[";
				            for(var o in obj){
				                str += this.serialize(obj[o]) +",";
				            }
				            if(str.substr(str.length-1) == ",")
				                str = str.substr(0,str.length -1);
				            return str + "]";
				            break;
				        case Boolean:
				            return "\"" + obj.toString() + "\"";
				            break;
				        case Date:
				            return "\"" + obj.toString() + "\"";
				            break;
				        case Function:
				        	return "\"" + obj.toString() + "\"";
				            break;
				        case Number:
				            return "\"" + obj.toString() + "\"";
				            break; 
				        case String:
				            return "\"" + obj.toString() + "\"";
				            break;  
				        default :
				        	return "\"" + '构造函数为:'+obj.constructor.toString() + "\"";
				    }
				},
				/**
				 * 比较是否短于所给的长度值
				 * @param v
				 * @param len
				 * @return
				 */
				equalLength : function(v, len){
					return this.strlen(v) <= len;
				},
				isNumber : function(val){
					return typeof(val) === 'number';
				},
				isString : function(val) {
				    return toString.call(val) === '[object String]';
				},
				isFunction : function(val) {
				    return toString.call(val) === '[object Function]';
				},
				isRegExp : function(val) {
				    return toString.call(val) === '[object RegExp]';
				},
				isObject : function(val) {
				    return val === Object(val);
				},
				isArray : Array.isArray || function(val) {
				    return toString.call(val) === '[object Array]';
				},
				isUrl : function(url){
					var htmlReg = /(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
					return htmlReg.test(url);
				},
				makeArray:function (o) {
	                if (o == null) {
	                    return [];
	                }
	                if (ns.util.isArray(o)) {
	                    return o;
	                }

	                // The strings and functions also have 'length'
	                if (typeof o.length !== 'number'
	                    // form.elements in ie78 has nodeName "form"
	                    // then caution select
	                    // || o.nodeName
	                    // window
	                    || o.alert
	                    || ns.util.isString(o)
	                    || ns.util.isFunction(o)) {
	                    return [o];
	                }
	                var ret = [];
	                for (var i = 0, l = o.length; i < l; i++) {
	                    ret[i] = o[i];
	                }
	                return ret;
	            }
			};
		})();
	})(devtool);

	/**
	 * DeveloperToolbar
	 * 开发者工具条
	 * log
	 */
	(function(ns,$){
		//兼容所有浏览器版本的开发者工具条
		function DeveloperToolbar(){
			this.init();
		};
		
		var _fpr = DeveloperToolbar.prototype;
		
		//工具条初始化
		_fpr.init = function(){
			var t = this;
			t._data = {};
			
			t.createFrame();
			t.eventBind();
		}; 
		//事件绑定
		_fpr.eventBind = function(){
			var t = this,
				ctn = t._data.root;
			
			//ctrl+1弹出debugger界面
			$(document).keyup(function(e){
				if(e.ctrlKey&&e.keyCode==97){
					if(t.ifShow){
						t.hide();
					}else{
						t.show();
					}
				}
				return false;
			});
			
			//关闭
			$('._div-close').click(function(e){
                e.preventDefault();
                e.stopPropagation();
				t.hide();
			});
            //刷新
            $('._div-refresh').click(function(e){
                e.preventDefault();
                e.stopPropagation();
                t.refresh();
            });
			
			//编辑框enter
			t._data.editCtn.keyup(function(e){
				if(e.keyCode==13){
					var v = t._data.editCtn.find('input').val();
					if(!v){
						return;
					}
					t.compile(v);
					t._data.editCtn.find('input').val('');
				}
			});
		};
		//创建工具条框架
		_fpr.createFrame = function(){
			var t = this,
				rootId = 'dev_toolbar_'+(new Date()-0),
				rootTemp = t.template.mainFrame.join(''),
				logTemp = t.template.logFrame.join(''),
				editTemp = t.template.editer.join(''),
				rootCss = t.template.mainFrameCss,
				logCss = t.template.logFrameCss,
				editCss = t.template.editerCss;
			
			t._data.rootId = rootId;
			t._data.root = $(rootTemp);
			t._data.root.css(rootCss).attr(rootId);
			
			t._data.logCtn = $(logTemp).css(logCss);
			t._data.editCtn = $(editTemp);
			t._data.editCtn.find('input').css(editCss);
			
			t._data.root.find('._developer-toolbar-ctn').append(t._data.logCtn).append(t._data.editCtn);
			$('body').append(t._data.root);
		};
		//打印
		_fpr.log = function(content,type){
			var t = this,
				style = type=='error'?'color:red':'',
				content = (ns.util.serialize(content)+'').replace(/^\"/,'').replace(/\"$/,''),
				p = $('<p style="'+style+'"></p>').text(content);
			
			t._data.logCtn.append(p);
			t._data.logCtn.scrollTop(10000);
			t.show();
		};
		//编译
		_fpr.compile = function(str){
			var t = this;
			log('--------------------------------------------------------------------------');
			log('输入 ：'+str);
			try{
				var retS = window.eval.call(window,str);
				t.log(retS);
			}catch(e){
				t.log(e.toString(),'error');
			}
		};
		//执行
		_fpr.execution = function(str){
			
		};
		//显示
		_fpr.show = function(){
			this.ifShow = true;
			this._data.root.slideDown();
			this._data.editCtn.find('input').focus();
		};
		//隐藏
		_fpr.hide = function(){
			this.ifShow = false;
			this._data.root.hide();
		};
        //刷新
        _fpr.refresh = function(){
            this._data.root.find('._log-ctn').empty();
        };
		_fpr.template = {
				mainFrame : ['<div style="position:fixed;_position:absolute;bottom:0;left:0;color:#000">',
				             '	<div class="_developer-toolbar-ctn" style="padding:5px;margin:5px;background:#fff;"><a class="_div-close" href="javascript:void(0)" style="color:black;float:right;text-decoration:none;">关闭</a><a class="_div-refresh" href="javascript:void(0)" style="color:black;float:right;text-decoration:none;">刷新</a>控制台<span style="font-size:12px">(按ctrl+1可开关控制台)</span>：</div>',
				             '</div>'],
				mainFrameCss : {
					'background'	: '#ccc',
					'margin'		: 0,
					'padding'		: 0,
					'z-index'		: 9999,
					'width'			: '100%',
					'overflow' 		: 'hidden',
					'bottom'		: '0px',
					'display'		: 'none',
					'font-size'		: '14px',
					'line-height'	: '1.5',
                    'zoome'         : 1
				},
				
				logFrame : ['<div class="_log-ctn"></div>'],
				logFrameCss : {
					'height'		: 200,
					'overflow-y'	: 'auto'
				},
				
				editFrame : ['<div class="_edit-ctn"></div>'],
				editFrameCss : {
					'border' : '1px solid #999'
				},
				
				editer : ['<div style="border:1px solid #555;"><input type="text" class="_editer"/></div>'],
				editerCss : {
					'width'			: '100%',
					'border'		: 'none',
					'height'		: '30px',
					'line-height'	: '30px',
					'overflow'		: 'hidden'
				}
		};
		
		(function(){
			var dt = new DeveloperToolbar();
			//声明到全局
			window.log = function(content,type){
				dt.log(content,type);
			};
		})();
	})(devtool,jQuery);
    return devtool;
});
	


