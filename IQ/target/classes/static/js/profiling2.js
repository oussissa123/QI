
function constraints_correlation_load(){
    var panel = document.getElementById("constraints_correlation_");
    panel.innerHTML = '<canvas id="constraints_correlation" height="100" width="300"></canvas>'
}

function constraints_correlation_remove(){
    var panel = document.getElementById("constraints_correlation_");
    panel.innerHTML = ''
}

function selectedSource(){
    var x = document.getElementById("Constraint_Selected");
    var val = x.options[x.selectedIndex].value;
    constraints_correlation_remove();
    if (val){
        var param = {"method":"Post", "body":"{'Constraint_Position':'"+val+"'}"}
        var url = adr+"constraints/correlation"
        fetch(url, param).then(e=>e.json()).then(e => {
                //e.id e.count
                //alert(e)
                //alert(e.id)
                constraints_correlation_load();
                var ctx3 = document.getElementById('constraints_correlation').getContext('2d');
                var chart3 = new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: e.id,
                        datasets: [{
                            label: 'Correlation with '+val,
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
        }).catch(e=>alert(e));
    }
}
