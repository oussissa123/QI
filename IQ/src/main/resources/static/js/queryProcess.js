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

    var content = "{'query':'"+query+"', 'operator':'"+operator+"', 'measure':'"+measure+"', 'filterValue':"+filter_value+" 'selectedConstraints':"+selectedConstraints+"}"; 

    alert(content)


    var X =['A', 'B', 'C']
    var Y = [1,3,2]
    var X1 =['G', 'E', 'F']
    var Y1 = [3,2,4]
    
    //alert("123")

    display_subsets(X1, Y1);
    display_by_constraint(X, Y)
    
}

function getOperateursValue(){
	return document.querySelector('input[name="operateurs"]:checked').value;
}

function getMeasuresValue(){
	return document.querySelector('input[name="measures"]:checked').value;
}