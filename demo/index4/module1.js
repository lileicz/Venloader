amkit.add('./module2',function(){
	log('module1(ignore module3) compiled');
	return {
		name : 'module1'
	};
}).ignore('/demo/index4/module1');
amkit.add(['./module3'],function(){
	log('module2 compiled');
	return {
		name : 2
	};
}).ignore('/demo/index4/module2');
amkit.add(['./module1'],function(a){
	log('module3 compiled');
	return {
		name : 3
	};
}).ignore('/demo/index4/module3');