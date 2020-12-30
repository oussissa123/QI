var constraint_for_query;

function QueryProcess(){
    var part = adr+"others/queryProcess.html"
    fetch(part).then(e => e.text()).then(e => {
        var content = document.getElementById('content');
        content.innerHTML = e;
        loadConstraints_for_query();
    }).catch(ef => {});	
}

function loadConstraints_for_query(){
    fetch(adr+"getConstraints").then(e => e.json()).then(e => {
		constraint_for_query = e;
		var constraints_to_check = document.getElementById("constraints_to_check");
		var res = '';
		for (var j = 0; j < e.length; j++) {
            var val = e[j];
            res += '<div style="display: inline; margin-right: 10px;"><input type="checkbox" id="'+val.id+'" value="'+val.id+'" checked></input><label for="'+val.id+'">'+val.id+'</label></div>';
		}
		constraints_to_check.innerHTML = res;
	}).catch(e => alert(e));
}

function giveNext(){
    alert("Load the next");
}


function simple_statistics_by_constraint_load(){
    var y = document.getElementById("simple_statistics_by_constraint_");
    y.innerHTML = '<canvas id="simple_statistics_by_constraint"></canvas>'
}

function simple_statistics_by_constraint_remove(){
    var y = document.getElementById("simple_statistics_by_constraint_");
    y.innerHTML = ''
}

function simple_statistics_subset_constraints_load(){
    var y = document.getElementById("simple_statistics_subset_constraints_");
    y.innerHTML = '<canvas id="simple_statistics_subset_constraints"></canvas>'
}

function simple_statistics_subset_constraints_remove(){
    var y = document.getElementById("simple_statistics_subset_constraints_");
    y.innerHTML = ''
}

function display_subsets(X, Y){

    simple_statistics_subset_constraints_remove();
    simple_statistics_subset_constraints_load();    
    var ctx3 = document.getElementById('simple_statistics_subset_constraints').getContext('2d');
    var chart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: X,
            datasets: [{
                label: 'Distribution by subsets of constraints',
                data: Y,
                backgroundColor: 'rgb(127,50,127)'
            }]
        },
        options: {
            legend: {
                display: false,
                labels: {
                display: false
                }
            },
            scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
            }
    }
    });	    
}


function display_by_constraint(X, Y){   
    //alert('hahah')
    simple_statistics_by_constraint_remove();
    simple_statistics_by_constraint_load();    
    var ctx3 = document.getElementById('simple_statistics_by_constraint').getContext('2d');
    var chart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: X,
            datasets: [{
                label: 'Distribution by constraint',
                data: Y,
                backgroundColor: 'rgb(127,127,127)'
            }]
        },
        options: {
            legend: {
                display: false,
                labels: {
                display: false
                }
            },
            scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
            }
    }
    });	    
}

function getSelectedConstraints_(){
    var pos = 0;
    if (constraint_for_query){
        for (var j = 0; j < constraint_for_query.length; j++) {
            var val = constraint_for_query[j];
            id = val.id
            position = val.position
            var cst = document.getElementById(id);
            if (cst.checked){
                //alert("ConstraintID: "+id+"\n Position: "+position)
                pos += Math.pow(2, position)
            }
        }
    }
    return pos;
}

function validQuery(){
    
    var query = document.getElementById("query").value;
    var operator = getOperateursValue();
    var measure = getMeasuresValue();
    var filter_value = document.getElementById("filter_value").value;
    var selectedConstraints = getSelectedConstraints_();
    var content = '';
    if (operator=='top-k'){
        filter_value = parseInt(filter_value); 
        if (filter_value){
            content = "{'query':'"+query+"', 'operator':'"+operator+"', 'measure':'"+measure+"', 'filterValue':"+filter_value+" 'selectedConstraints':"+selectedConstraints+"}"; 
            display_figs(content);
        }else
            alert("The filter value most be an integer");
    }

    if (operator=='threshold'){
        var start = filter_value.replaceAll(" ", "");
        filter_value = start[0]; 
        if (filter_value){
            switch (filter_value) {
                case '=':
                    operator = '='
                    filter_value = parseInt(start.substring(1));
                    break;
                case '<':
                    if (start[1]=='='){
                        operator = '<='
                        filter_value = parseInt(start.substring(2));
                    }else {
                        operator = '<'
                        filter_value = parseInt(start.substring(1));
                    }
                    break;
                case '>':
                    if (start[1]=='='){
                        operator = '>='
                        filter_value = parseInt(start.substring(2));
                    }else {
                        operator = '>'
                        filter_value = parseInt(start.substring(1));
                    }
                    break;
                default:
                  operator='NaN';
            }
        }
        if (filter_value && operator != 'NaN'){
            content = "{'query':'"+query+"', 'operator':'"+operator+"', 'measure':'"+measure+"', 'filterValue':"+filter_value+" 'selectedConstraints':"+selectedConstraints+"}"; 
            display_figs(content);
        }else
            alert("The filter value most be for example: =4 or <4 or >4 or <=4 or >=4 with 4 the theshold");
    }
    if (operator=='all'){
        content = "{'query':'"+query+"', 'operator':'"+operator+"', 'measure':'"+measure+"', 'filterValue':"+filter_value+" 'selectedConstraints':"+selectedConstraints+"}"; 
        display_figs(content);
    }
}

function display_figs(data){

    var param = {'method':'Post', 'body':data};
    var url = adr+"query/execution/"

    fetch(url,param).then(e => e.json()).then(e => {			
        
        var X1 =['A', 'B', 'C']
        var Y = [1,3,2]
        var X =['1', '2', '3']
        var Y1 = [3,2,4]

        display_subsets(X1, Y1);
        display_by_constraint(X, Y)
        tab = []
        for(var i=0; i<20; i++){
            tab.push(["a"+i, "b"+i, "c"+i])
        }
        display_data({"attrs":["A", "B", "C"], "data":tab})

    }).catch(e => {alert(e+': Error in query')});



}

function display_data(data){
    var tab = document.getElementById("result");
    var attrs = data["attrs"]
    var datas = data["data"]
    var res = '<tr style="background: #aaa; color: white;">';//'<tr> <th>Selection</th> <th>Constraint ID</th> <th>Description</th>   </tr>';
    attrs.forEach(e => {res += '<th>'+e+'</th>';});
    res += '</tr>';
    datas.forEach(el => {var t='<tr>'; el.forEach(e => {t += '<th>'+e+'</th>';}); t+='</tr>'; res+=t;});
    tab.innerHTML = '<table>'+res+'</table>';
    //alert("display data")
}

function getOperateursValue(){
	return document.querySelector('input[name="operateurs"]:checked').value;
}

function getMeasuresValue(){
	return document.querySelector('input[name="measures"]:checked').value;
}




function top_k(){
    //alert('top k')
    document.getElementById("filter_value").style = "display: block;";
    document.getElementById("filter_value").placeholder = 'Filter value';
}
function threshold(){
    //alert('threshold')
    document.getElementById("filter_value").style = "display: block;";
    document.getElementById("filter_value").placeholder = 'op Filter value (op: = | <= | >= | < | >)';
}
function all_(){
    //alert('all')
    document.getElementById("filter_value").style = "display: none;";
}








