VL.add('./module2',function(){
	log('module1(alias module3) compiled');
	return {
		name : 'module1'
	};
}).alias('/demo/index3/module3');

