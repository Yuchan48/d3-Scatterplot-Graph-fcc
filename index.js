const w = 800;
const h = 550;
const padding = 40;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

var tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip");


                  
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then((dataset) => {
  
  
  const yearMin = Math.min(...dataset.map(d => d.Year - 1));
  
  const yearMax = Math.max(...dataset.map(d => d.Year + 1));

  const timeFormat = d3.timeFormat("%M:%S");
  
  dataset.forEach(d => {
	var timeNum = d.Time.split(":");
	d.Time = new Date(Date.UTC(1990, 0, 0, 0, timeNum[0], timeNum[1]))

}
 )
  
  
 const xScale = d3.scaleTime()
                 .domain([yearMin, yearMax])
                 .range([padding, w - padding]); 
  
 
 const yScale = d3.scaleTime()
   .domain(d3.extent(dataset, d => d.Time))              //.domain([d3.max(dataset, (d) => d.Time), d3.min(dataset, (d) => d.Time)])
                 .range([padding, h -padding]);  
 
 const rect1Color = "red";  
  
 const rect2Color = "blue";
  
  
 const chart = svg.append("g");
  
 const dot = chart.selectAll("circle")
                 .data(dataset)
                 .enter()
                 .append("circle")
                 .attr("class", "dot")
                 .attr("data-xvalue", d => d.Year)
                 .attr("data-yvalue", d => d.Time)
                 .attr("r", 7)
                 .attr("cy", d => yScale(d.Time))
                 .attr("cx", d => xScale(d.Year))
                 .style("fill", d => { 
           if (d.Doping !== ""){
             return rect1Color;
           } else {
	           return rect2Color;
             }
           })
                 //.style("fill", "red")
                 .style("stroke", "black")
                 .on("mouseover", d => {
	tooltip.attr("id", "tooltip")
	       .style("opacity", 1)
	       .attr("data-year", d.Year)
         .attr("data-time", d.Time)          
	       .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 60) + "px")
            .html("<div style='font-size: 16px; font-weight: bold;'>" + d.Name + "</div><br><div style='font-size: 13px;'>" + d.Nationality + "<br>Year: " + d.Year + ",     Time: " + timeFormat(d.Time) + "<br><br>" + d.Doping + "</div>")       
            
               })
                  .on("mouseout", d => {
                    tooltip.style("opacity", 0)
                  })
  
  
 const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format(""));

 const yAxis = d3.axisLeft(yScale)
                .tickFormat(timeFormat);   
  
  
chart.append("g")
     .attr("class", "tick")
     .attr("id", "x-axis")
     .attr("transform", "translate(0," + (h - padding) + ")")
     .call(xAxis);

chart.append("g")
     .attr("class", "tick")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ", 0)" )
     .call(yAxis);
  
 const legend = chart.append("rect")
                     .attr("id", "legend")
                     .attr("x", w - 220)
                     .attr("y", 30)
                     .style("fill", "#FBEAD6")
                     .attr("rx", 10)
                     .attr("ry", 10)
                     .attr("stroke", "#F2D680")
                     .attr("stroke-width", 3)
 
 chart.append("circle")
      .attr("r", 7)
      .attr("cx", w - 203)
      .attr("cy", 60)
      .attr("fill", "red")
      .attr("stroke", "black")
  
  chart.append("text")
       .text("Riders with doping allegations")
       .attr("x", w - 187)
       .attr("y", 64)
       .attr("font-size", 13)
 
  chart.append("circle")
      .attr("r", 7)
      .attr("cx", w - 203)
      .attr("cy", 100)
      .attr("fill", "blue")
      .attr("stroke", "black")
      
  chart.append("text")
       .text("No doping allegations")
       .attr("x", w - 187)
       .attr("y", 104)
       .attr("font-size", 13)
  
  
})