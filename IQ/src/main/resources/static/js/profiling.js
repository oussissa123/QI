var constraints ;

function choose_filter(){
	var cons = document.getElementById("huey");
	var number = document.getElementById("dewey");

	var selectedConstraint = document.getElementById("selectedConstraint")
	var numberConstraints = document.getElementById("numberConstraints")

	if (cons.checked){
		selectedConstraint.style = "display:block";
		numberConstraints.style = "display:none";
	}

	if (number.checked){
		selectedConstraint.style = "display:none";
		numberConstraints.style = "display:block"; 	
	}

} 

function distributionviolationsProportion(){

fetch(adr+'percentVio').
then(resp => resp.json()).then(resp =>{
var vio = resp["vio"] ;
var novio = resp["novio"] ;

var vio_ = vio+'';
var novio_ = novio+'';

var vio__ = ''
var novio__ = ''
var a1 = 0
for(var i=0; i<vio_.length; i++){
	if (vio_[i]=='.')
		a1 = 1
	vio__ = vio__ + vio_[i]
	if (a1>0)
		a1++
	if (a1==4)
		break;
}

a1 = 0
for(var i=0; i<novio_.length; i++){
	if (novio_[i]=='.')
		a1 = 1
	novio__ = novio__ + novio_[i]
	if (a1>0)
		a1++
	if (a1==4)
		break;
}
document.getElementById("inc_vio_").innerHTML = '<canvas id="inc_vio" height="100" width="300"></canvas>'
var ctx = document.getElementById('inc_vio').getContext('2d');
var chart = new Chart(ctx, {
	type: 'pie',
	data: {
		labels: ["Inconsistent ("+vio__+"%)", "Consistent ("+novio__+"%)"],
		datasets: [{
			label: 'Database Inconsistency',
			data: [vio, novio],
			backgroundColor:['rgba(255, 0, 0, 0.5)', 'rgba(0,200, 100, 0.6)']
		}]
	},
	options: []   
});	  
}).catch(error => {alert(error)});    
}

function distributionBySubsetViolation(){
	fetch(adr+'distributionviolationssubset').then(e => e.json()).then(e => {	
	document.getElementById("dist_sub_").innerHTML='<canvas id="dist_sub" height="100" width="300"></canvas>';	
	var ctx4 = document.getElementById('dist_sub').getContext('2d');
	var chart4 = new Chart(ctx4, {
		type: 'bar',
		data: {
			labels: e.position,
			datasets: [{
				label: 'Distribution by subset of constraints',
				data: e.count,
				backgroundColor: 'rgb(50,127,127)'
			}]
		},
		options: {
			scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
			}
		} 
	});
	}).catch(er => {alert(er)});
}


function distributionviolations(){
	fetch(adr+'distributionviolations').then(e => e.json()).then(e => {
		document.getElementById("dist_vio_").innerHTML = '<canvas id="dist_vio" height="100" width="300"></canvas>';
		var ctx2 = document.getElementById('dist_vio').getContext('2d');
		X = e["Violations"]
		Y = e["percent"]
		//push
		var chart2 = new Chart(ctx2, {
			type: 'bar',
			data: {
				labels: X,
				datasets: [{
					label: 'Distribution by number of violations',
					data: Y,
					backgroundColor: 'rgb(127,127,50)'
				}]
			},
			options:{
				scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
				}
			}
		});
	}).catch(er => {});

}

function distributionByConstraints(){	
	fetch(adr+'distributionviolationsbyconstraint').then(e => e.json()).then(e => {
		document.getElementById("dist_cons_").innerHTML='<canvas id="dist_cons" height="100" width="300"></canvas>';
		var ctx3 = document.getElementById('dist_cons').getContext('2d');
		var chart3 = new Chart(ctx3, {
			type: 'bar',
			data: {
				labels: e.position,
				datasets: [{
					label: 'Distribution by constraint',
					data: e.count,
					backgroundColor: 'rgb(127,50,127)'
				}]
			},
			options: {
				scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
				}
		}
		});	
	}).catch(er => {alert(er)});
}

function figsSimpleStatistics(){
	distributionviolationsProportion();
	distributionviolations();
	distributionByConstraints();
	distributionBySubsetViolation();
}


//for menu

function simpleStatistics(){
	var part = adr+"others/profiling1.html"
	fetch(part).then(e => e.text()).then(e => {
		var content = document.getElementById('content');
		content.innerHTML = e;
		figsSimpleStatistics();
		loadConstraints();

	}).catch(ef => {});	
}

function loadConstraints(){
	fetch(adr+"getConstraints").then(e => e.json()).then(e => {
		constraints = e;
		var constraint_description = document.getElementById("constraint_description");
		var res = '<tr><th>Selection</th> <th>Constraint ID</th> <th>Description</th></tr>';
		for (var j = 0; j < e.length; j++) {
			var val = e[j];
			var position = '<th><input type="checkbox" id="pos'+val.position+'" checked></input></th>';
			var id = "<th>"+val.id+"</th>";
			var description = "<th>"+val.description+"</th>";
			res += "<tr>"+"\n"+position+"\n"+id+"\n"+description+"\n"+"</tr>";
		}
		constraint_description.innerHTML = res;
	}).catch(e => alert(e));
}

//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------


function distributionviolationsProportion_(considered){
	fetch(adr+'consider/percentVio?considered='+considered).
	then(resp => resp.json()).then(resp =>{
	var vio = resp["vio"] ;
	var novio = resp["novio"] ;
	

	var vio_ = vio+'';
	var novio_ = novio+'';
	var vio__ = ''
	var novio__ = ''
	var a1 = 0

	for(var i=0; i<vio_.length; i++){
		if (vio_[i]=='.')
			a1 = 1
		vio__ = vio__ + vio_[i]
		if (a1>0)
			a1++
		if (a1==4)
			break;
	}

	a1 = 0
	for(var i=0; i<novio_.length; i++){
		if (novio_[i]=='.')
			a1 = 1
		novio__ = novio__ + novio_[i]
		if (a1>0)
			a1++
		if (a1==4)
			break;
	}

	document.getElementById("inc_vio_").innerHTML = '<canvas id="inc_vio" height="100" width="300"></canvas>';
	var ctx = document.getElementById('inc_vio').getContext('2d');
	var chart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ["Inconsistent ("+vio__+"%)", "Consistent ("+novio__+"%)"],
			datasets: [{
				label: 'Database Inconsistency',
				data: [vio, novio],
				backgroundColor:['rgba(255, 0, 0, 0.5)', 'rgba(0,200, 100, 0.6)']
			}]
		},
		options: []   
	});	  
	}).catch(error => {alert(error+" proportion violation")});    
}
	
function distributionBySubsetViolation_(considered){

	fetch(adr+'consider/distributionviolationssubset?considered='+considered).then(e => e.json()).then(e => {	
	
	document.getElementById("dist_sub_").innerHTML = '<canvas id="dist_sub" height="100" width="300"></canvas>';
	var ctx4 = document.getElementById('dist_sub').getContext('2d');
	var chart4 = new Chart(ctx4, {
		type: 'bar',
		data: {
			labels: e.position,
			datasets: [{
				label: 'Distribution by subset of constraints',
				data: e.count,
				backgroundColor: 'rgb(50,127,127)'
			}]
		},
		options: {
			scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
			}
		} 
	});
	}).catch(er => {alert(er+" by subset of of constraints")});
}
	
	
function distributionviolations_(considered){
	fetch(adr+'consider/distributionviolations?considered='+considered).then(e => e.json()).then(e => {
		document.getElementById("dist_vio_").innerHTML = '<canvas id="dist_vio" height="100" width="300"></canvas>';
		var ctx2 = document.getElementById('dist_vio').getContext('2d');
		X = e["Violations"]
		Y = e["percent"]
		//push
		var chart2 = new Chart(ctx2, {
			type: 'bar',
			data: {
				labels: X,
				datasets: [{
					label: 'Distribution by number of violations',
					data: Y,
					backgroundColor: 'rgb(127,127,50)'
				}]
			},
			options:{
				scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
				}
			}
		});
	}).catch(er => {});

}
	
	
function distributionByConstraints_(considered){	
	fetch(adr+'consider/distributionviolationsbyconstraint?considered='+considered).then(e => e.json()).then(e => {
		
		document.getElementById("dist_cons_").innerHTML = '<canvas id="dist_cons" height="100" width="300"></canvas>';
		var ctx3 = document.getElementById('dist_cons').getContext('2d');
		var chart3 = new Chart(ctx3, {
			type: 'bar',
			data: {
				labels: e.position,
				datasets: [{
					label: 'Distribution by constraint',
					data: e.count,
					backgroundColor: 'rgb(127,50,127)'
				}]
			},
			options: {
				scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
				}
		}
		});	
	}).catch(er => {alert(er+": by constraint")});
}

 function do_filter(){  	
	//figsSimpleStatistics();
	var considered = 0;
	for(var i=0; i<constraints.length;i++){
		var pos = constraints[i].position;
		var d = document.getElementById("pos"+pos);
		if (d.checked)
			considered += Math.pow(2, pos)
	}
	distributionviolationsProportion_(considered)
	distributionBySubsetViolation_(considered)
	distributionviolations_(considered);
	distributionByConstraints_(considered);
	
}