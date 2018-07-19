svg_2 = d3.select("#line-container")
                .append("svg")
                .attr('width', '40%')
                .attr('height', '500px');


d3.csv('data/sample.csv')
  .then(function(data) {

  xScale = d3.scaleLinear().domain([1,10.5]).range([20,480]);
   yScale = d3.scaleLinear().domain([0,35]).range([480,20]);

   var xAxis = d3.axisBottom(xScale)
            .tickSize(4)
            .tickValues([1,2,3,4,5,6,7,8,9,10]);

   svg_2.append("g").attr("id", "xAxisG")
                    .attr("transform", "translate(0,480)")
                    .call(xAxis);



   yAxis = d3.axisRight(yScale)
     .ticks(10)
     .tickSize(470);
    svg_2.append("g").attr("id", "yAxisG").call(yAxis);

    d3.selectAll('#yAxisG')
      .selectAll('line')
      .style('stroke', 'grey')

    createLinea(data, 'tweets')
    createLinea(data, 'retweets')
    createLinea(data, 'favorites')
})


function createLinea(data, campo){
    var tweetLine = d3.line()
                    .x(function(d) {
                        return xScale(d.day);
                    })
                    .y(function(d) {
                    return yScale(d[campo]);
                    });

    svg_2
        .append("path")
        .attr('id', 'linea'+campo)
        .attr("d", tweetLine(data))
        .attr("fill", "none")
        .attr("stroke", "darkred")
        .attr("stroke-width", 2)
        .on('mouseover', function (d){d3.select('#linea'+campo)
                                        .attr('stroke','blue')})
        .on('mouseout', function (d){d3.select('#linea'+campo)
                                        .attr('stroke','darkred')});


    svg_2.selectAll("circle."+campo)
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "tweets")
     .attr("r", 2.5)
     .attr("cx", function(d) {return xScale(d.day)})
     .attr("cy", function(d) {return yScale(d[campo])})
     .style("fill", "black")
     .on('mouseover', overPoint)
     .on('mouseout', awayPoint)
     ;
}


function overPoint(datapoint){
    xScale = d3.scaleLinear().domain([1,10.5]).range([20,480]);
    yScale = d3.scaleLinear().domain([0,35]).range([480,20]);

    d3.select(this)
      .each(function(p,i){
                 d3.select(this)
                   .style('fill', 'red')})

    lineGenerator = d3.line();

    svg_2//select(this)
      .append('path')
      .attr('id', 'lineeCoordx')
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [d3.select(this).attr('cx'),d3.select(this).attr('cy')]]))
      .style('stroke', 'black')
      .transition()
      .duration(1000)
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [0, d3.select(this).attr('cy')]]))
      .style("stroke-dasharray", ("3, 3"))

    svg_2//select(this)
      .append('path')
      .attr('id', 'lineeCoordy')
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [d3.select(this).attr('cx'),d3.select(this).attr('cy')]]))
      .style('stroke', 'black')
      .style("stroke-dasharray", ("3, 3"))
      .transition()
      .duration(1000)
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [d3.select(this).attr('cx'), 480]]))
      .style("stroke-dasharray", ("3, 3"))


};

function awayPoint(datapoint){
    svg_2.selectAll("#lineeCoordx").each(function(p,i){
            d3.select(this).transition().duration(150).remove()
    });
    svg_2.selectAll("#lineeCoordy").each(function(p,i){
            d3.select(this).transition().duration(150).remove()
    });

    d3.select(this)
      .style('fill', 'black')

}