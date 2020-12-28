
function dragstart(e){
	//alert(e.target.id)
	console.log(e.target.id)	
	e.dataTransfer.effectAllowed = 'copy';
	e.dataTransfer.setData('text', e.target.id);
	return false;
}

function dragover(e){
	if (e.preventDefault) e.preventDefault();
	e.dataTransfer.dropEffect = 'copy'; 
}

function drop(e, ca){
	if (e.stopPropagation) e.stopPropagation();
	var id = e.dataTransfer.getData('text');
	var theitem = document.getElementById(id);
	theitem.parentNode.removeChild(theitem);  
	theitem.className='itemblurred';
	var y  = document.createElement('div');
	y.innerHTML = theitem.innerHTML;
	y.className="produit";
	y.draggable="true";
	y.addEventListener('dragstart', dragstart)
	y.id = id;
	y.style="display: inline-block; padding:0.5em; margin-top:0.5em;margin-left:0.5em;background: #ddd; border: 1px solid black; border-radius: 5px;";
	ca.appendChild(y);
	e.preventDefault(); //
	exploration_by_constraint();
}

function nextColor(tab){
	rr = (tab[0]*2)%255;
	gg = (tab[1]*3)%255;
	bb = (tab[2]*5)%255;
	tt = []
	tt.push(rr);tt.push(gg);tt.push(bb)
	return tt;
}

function selectedSource_(){	
	//var limit = document.getElementById("limit");
	var from = document.getElementById("from").value;
	var where = document.getElementById("where").value;

	///,[\s]*|[\s]+/
	from = from.split(/[\s]*,[\s]*/)
	where = where.replaceAll(' ', '').split(',')

	//alert("test")


	var attrs = new Set([]); 

	for(var i=0; i<where.length; i++){
		w = where[i].split(/<>|=|<=|>=|<|>/)
		attrs.add(w[0]);
		attrs.add(w[1]);
	}


	for(var i = 0; i<from.length; i++){
		f = from[i].split(/[\s]+/)
		var rel = '-'
		var alea = '-'
		var ab = true
		for(var j=0; j<f.length; j++){
			if (f[j]!=''){
				if (ab){
					rel = f[j]
					ab = false
				}
				else{
					alea = f[j]
					break
				}
			}
		}
		if (alea!='-')
			attrs.add(alea+'.id')
		else 
			attrs.add(rel+'.id')
	}

	var attributs = document.getElementById("attributs")
	var attribut_to_show = document.getElementById("attribut_to_show")
	var attribut_to_group = document.getElementById("attribut_to_group")
	var attribut_to_count = document.getElementById("attribut_to_count")

	attributs.innerHTML = ''
	attribut_to_show.innerHTML = ''
	attribut_to_group.innerHTML = ''
	attribut_to_count.innerHTML = ''


	attrs.forEach(e => {
		if (e!=""){
			var y  = document.createElement('div');
			y.innerHTML = e;
			y.draggable="true";
			y.addEventListener('dragstart', dragstart)
			y.id = e;
			y.style="display: inline-block; padding:0.5em; margin-top:0.5em;margin-left:0.5em;background: #ddd; border: 1px solid black; border-radius: 5px;";
			attributs.appendChild(y);
		}
	});
	clear_constraints_exploration();
}

function clear_constraints_exploration(){
	var container = document.getElementById('constraints_exploration_container');
	//alert(container);
	container.innerHTML = '';
}

function set_constraints_exploration(){
	var container = document.getElementById('constraints_exploration_container');
	container.innerHTML = '<canvas id="constraints_exploration" height="100" width="300"></canvas>';
}

function exploration_by_constraint(){

	var attribut_to_show = document.getElementById("attribut_to_show")
	var attribut_to_group = document.getElementById("attribut_to_group")
	var attribut_to_count = document.getElementById("attribut_to_count")

    var children_attribut_to_show = attribut_to_show.childNodes;
    var children_attribut_to_group = attribut_to_group.childNodes;
    var children_attribut_to_count = attribut_to_count.childNodes;

	clear_constraints_exploration();

	if (attribut_to_show.hasChildNodes() && attribut_to_group.hasChildNodes() && attribut_to_count.hasChildNodes()){
		
		var limit = document.getElementById("limit").value;
		var from = document.getElementById("from").value;
		var where = document.getElementById("where").value;
		group = []; select = []; count = [];

		attribut_to_show.childNodes.forEach(e => {
			if (e)
				select.push('"'+e.innerText+'"')
		})
		attribut_to_group.childNodes.forEach(e => {
			if (e)
				group.push('"'+e.innerText+'"')
		})
		attribut_to_count.childNodes.forEach(e => {
			if (e)
				count.push('"'+e.innerText+'"')
		})

		
		var data = "{'from':'"+from+"', 'where':'  "+where+" ', 'limit':' "+limit+" ', 'select':["+select+"], 'group':["+group+"], 'count':["+count+"]}";
		//var param = {'method':'Post', 'body': content};
		var param = {'method':'Post', 'body':data};
		var url = adr+"exploration/by/constraints"

		fetch(url,param).then(e => e.json()).then(e => {			
			//alert('ici 2')
			set_constraints_exploration();
			var canvas = document.getElementById('constraints_exploration');
			var ctx = canvas.getContext('2d');
			var chart = new Chart(ctx, {
				type: 'bar',
				data: e,
				options: {
					legend: {
						display: false,
						labels: {
						display: false
						}
					},
					scales: {
						xAxes: [{
						stacked: true, // this should be set to make the bars stacked
						ticks: {
							beginAtZero: true
						}
						}],
						yAxes: [{
						stacked: true, // this also..
						ticks: {
							beginAtZero: true
						}
						}]
					}
				}
			});

		}).catch(e => {alert(e)});
	}
}
