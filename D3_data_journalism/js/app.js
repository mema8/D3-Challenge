// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // Reset SVG area when browser load and replace with resixed chart
    var svgArea = d3.select('body').select('svg');

    // Clear svg
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG dimentoins as the current window 
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

    // Append SVG element
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('height', svgHeight)
        // .attr('class', 'chart')
        .attr('width', svgWidth);

    // Append group element 
    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Read CSV file 
    d3.csv('./D3_data_journalism/data/data.csv').then(function(dataSmokers) {

        // Parse data 
        dataSmokers.forEach(function(data) {
            data.smokes =+data.smokes; 
            data.age =+data.age; 
            // console.log("smokes: ", d.smokes);
            // console.log("ages: " , d.age)
        }); 

        // Scales 
        var xBandScale = d3.scaleLinear()
            .domain([20, d3.extent(data, d => d.smokes)])
            .range([0, width]);
            // .padding(0.1);
        
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.extent(data, d => d.age)])
            .range([height, 0]);
        
        // Create axis 
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Append axis 
        chartGroup.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append('g')
            .call(leftAxis);
    
        // Append circles 
        var circlesGroup = chartGroup.selectAll('circle')
            .data(dataSmokers)
            .enter()
            .append('stateCircle')
            .attr('cx', d => xBandScale(d.smokes))
            .attr('cy', d => yLinearScale(d.age))
            .attr('r', '10')
            .attr('fill', 'gold')
            .attr('opacity', '.5');
            // .attr('stroke', 'yellow')
            // .attr('stroke-width', '1');

        // Create tool tip 
        // Initialize Tooltip
        var toolTip = d3.tip()
        .select('body')
        .append('toolTip')
        .attr("class", "d3-tip")
        
        // positioning the blue box (the info box)
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.smokes}<strong><hr>${d.age}`);
      });

        // Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(data, i) {
        toolTip.style('display', 'block');
        toolTip.html(`${data.abbr}`);
        })
        
        
        // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function() {
            toolTip.style('display', 'none');
        });


        // Create axes labels
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

// When the browser loads, makeResponsive() is called
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);