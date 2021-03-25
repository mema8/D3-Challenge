// @TODO: YOUR CODE HERE!
function makeResponsive() {

   
    var svgArea = d3.select('body').select('svg');

   
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    
    var svgWidth = window.innerWidth; 
    var svgHeight = window.innerHeight; 
    
    // var svgHeight = 960; 
    // var svgWidth = 500; 

    var margin = {
        top: 50, 
        bottom: 50, 
        left: 50, 
        right: 50
    }; 

    var width = svgWidth - margin.left - margin.right; 
    var height = svgHeight - margin.top - margin.bottom; 

   
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('height', svgHeight)

        
        .attr('width', svgWidth);

     
    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

     
    d3.csv('./D3_data_journalism/data/data.csv').then(function(dataSmokers) {

         
        dataSmokers.forEach(function(data) {
            data.smokes =+data.smokes; 
            data.age =+data.age; 
            
        }); 

        
        var xBandScale = d3.scaleLinear()
            .domain([20, d3.extent(data, d => d.smokes)])
            .range([0, width]);
          
        
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.extent(data, d => d.age)])
            .range([height, 0]);
        
         
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
         
        chartGroup.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append('g')
            .call(leftAxis);
    
         
        var circlesGroup = chartGroup.selectAll('circle')
            .data(dataSmokers)
            .enter()
            .append('stateCircle')
            .attr('cx', d => xBandScale(d.smokes))
            .attr('cy', d => yLinearScale(d.age))
            .attr('r', '10')
            .attr('fill', 'gold')
            .attr('opacity', '.5');
            

        
        var toolTip = d3.tip()
        .select('body')
        .append('toolTip')
        .attr("class", "d3-tip")
        
        
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.smokes}<strong><hr>${d.age}`);
      });

        
        chartGroup.call(toolTip);

        
        circlesGroup.on("mouseover", function(data, i) {
        toolTip.style('display', 'block');
        toolTip.html(`${data.abbr}`);
        })
        
        
        
        .on("mouseout", function() {
            toolTip.style('display', 'none');
        });


        
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokers ");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Ages ");



        }).catch(function(error) {
        console.log(error);
    });
}


makeResponsive();


d3.select(window).on("resize", makeResponsive);