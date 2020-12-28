var pieOptions = {
  events: false,
  animation: {
    duration: 500,
    easing: "easeOutQuart",
    onComplete: function () {
      var ctx = this.chart.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      this.data.datasets.forEach(function (dataset) {

        for (var i = 0; i < dataset.data.length; i++) {
          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
              total = dataset._meta[Object.keys(dataset._meta)[0]].total,
              mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
              start_angle = model.startAngle,
              end_angle = model.endAngle,
              mid_angle = start_angle + (end_angle - start_angle)/2;

          var x = mid_radius * Math.cos(mid_angle);
          var y = mid_radius * Math.sin(mid_angle);

          ctx.fillStyle = '#fff';
          if (i == 3){ // Darker text color for lighter background
            ctx.fillStyle = '#444';
          }
          var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
          //Don't Display If Legend is hide or value is 0
          if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
            //ctx.fillText(dataset.data[i], model.x + x, model.y + y);
            // Display percent in another line, line break doesn't work for fillText
            ctx.fillText(percent, model.x + x, model.y + y + 15);
          }
        }
      });               
    }
  }
};



 var param = {"method":"GET", 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        "Access-Control-Allow-Origin": "*" };
 
fetch('http://localhost:8080/percentVio', param).
    then(resp => resp.json()).
    then(resp => 
 {
    var vio = resp["vio"] ;
    var novio = resp["novio"] ;

	var ctx = document.getElementById('fig').getContext('2d');
	var chart = new Chart(ctx, {
	
	    type: 'pie',
	    data: {
	        labels: ['Inconsistent Tuples', 'Consistent Tuples'],
	        datasets: [{
	            label: 'Database Inconsistency',
	            data: [vio, novio],
	            backgroundColor:['rgba(255, 0, 0, 0.5)', 'rgba(0,200, 100, 0.6)']
	        }]
	    },
	    options: pieOptions
	    
	    
	});
	    
 }).catch(error => {alert(error)});