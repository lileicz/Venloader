VL.add('./module2',function(){
	log('module1(ignore module3) compiled');
	return {
		name : 'module1'
	};
}).alias('/demo/index4/module1');
VL.add(['./module3'],function(){
	log('module2 compiled');
	return {
		name : 2
	};
}).alias('/demo/index4/module2');
VL.add(['./module1'],function(a){
	log('module3 compiled');
	return {
		name : 3
	};
}).alias('/demo/index4/module3');