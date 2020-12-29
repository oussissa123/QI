function doPreprocess(){
	var part = adr+"others/preprocess.html"
	fetch(part).then(e => e.text()).then(e => {
		//alert(e);
		var content = document.getElementById('content');
		content.innerHTML = e;		
		//figsSimpleStatistics();
	}).catch(ef => {});	
 }
 //doPreprocess();

 function load_constraint(){
	alert('load constraint')
 }

 function preprocess(){
	 alert('preprocess')
 }