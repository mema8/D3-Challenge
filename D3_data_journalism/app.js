var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 30);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// (async function () {
d3.csv("/D3_data_journalism/data.csv").then(function(d3data) {

        // parse data
  d3data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
        });
        
    // xLinearScale 
  var xLinearScale = d3.scaleLinear().domain([d3.min(d3data, d => d.poverty) * 0.8, d3.max(d3data, d=> d.poverty) * 1.2]).range([0, width]);

    // y scale function
  var yLinearScale = d3.scaleLinear().domain([d3.min(d3data, d => d.healthcare) * 0.8, d3.max(d3data, d=> d.healthcare) * 1.2]).range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
  .call(leftAxis);

 // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(d3data)
    .enter()
    .append("g")
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .classed("stateCircle", true);

  chartGroup.append("g").selectAll("text")
    .data(d3data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare))
    .classed("stateText", true);

// Create group for 3 x-axis labels
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - ((margin.left/2)+2))
    .attr("x", 0 - (height / 2))
    .attr("value", "Healthcare")
    .classed("axis-text", true)
    .text("Healthcare (%)");
});