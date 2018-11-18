
svg_2 = d3.select("#line-container")
                .append("svg")
                .attr('width', '100%')
                .attr('height', '300px');

lenX = 500
lenY = 270
color = ["NAVY","TEAL","OLIVE","GREEN","LIME"]//[ "#7fcdbb", "#41b6c4", "#1d91c0"]

function dataArray(data) {
    arr = new Array()
    for (i = 0; i < data.length; i++){
        arr[i] = new Date(data[i].day)
    }
    return arr
}
function retweetArray_(data) {
    inquinanti = ['PM25', 'BENZENE']
    arr = new Array()
    for (i = 0; i < data.length; i++){
        for (j = 0; j < inquinanti.length; j++){
            arr.push(parseInt(data[i][inquinanti[j]]) + 10)
    }}
    return arr
}



d3.csv('data/linee.csv')
  .then(function(data) {
   var dateArray = dataArray(data)
   var retweetArray = retweetArray_(data)
   console.log(retweetArray)

   xDomain = d3.extent(data, function(d) {return new Date(d.day); })
   xScale = d3.scaleTime().domain(xDomain).range([20,lenX]);

   yScale = d3.scaleLinear().domain([0,Math.max.apply(null, retweetArray)]).range([lenY,20]);
   //var yScale = d3.scaleLog().domain([ 1, yScale_(101000)]).range([lenY,20]);
   //yScale = d3.scaleLinear().domain([0,Math.max.apply(null, retweetArray)]).range([lenY,20]);

   var  dateFormat = d3.timeFormat("%b %Y");
   var xAxis = d3.axisBottom(xScale)
                 .tickValues(dateArray)
                 .tickSize(15)
                 .tickFormat(dateFormat);

   svg_2.append("g").attr("id", "xAxisG")
                    .attr("transform", "translate(0," + lenY + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(-20)");

   yAxis = d3.axisLeft(yScale)
     .ticks(10)
     .tickSize(-lenX);

  svg_2.append("g")
       .attr("id", "yAxisG")
       .attr("transform", "translate(20," + 0 + ")")
       .call(yAxis);

  d3.selectAll('#yAxisG')
    .selectAll('line')
    .style('stroke', 'grey')
    .style('opacity', 0.3)

  width = 100;
  height = 270;
  legendVals = ['BENZENE',  'NO2',  'O3', 'PM10', 'PM25']
  var legendVals1 = d3.scaleOrdinal()
                      .domain(legendVals)
                      .range(["Aqua","Aquamarine","Azure","Beige","Bisque"]);

  //var color = d3.scaleOrdinal(d3.schemeCategory10)

  var svgLegned3 = d3.select(".legend3").append("svg")
            .attr("width", width).attr("height", height)

  var legend3 = svgLegned3.selectAll('.legend3')
            .data(legendVals1.domain())
            .enter().append('g')
            .attr("class", "legends3")
            .attr("transform", function (d, i) {
            {
                return "translate(0," + i * 20 + ")"
            }
        })

  legend3.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d, i) {
            return color[i]
        })


  legend3.append('text')
            .attr("x", 20)
            .attr("y", 9)
            .attr('class', function (d, i) {d + 'Legend'})
        //.attr("dy", ".35em")
        .text(function (d, i) {
            return d
        })
        .on('mouseover', function (datapoint) {d3.select(this)
                                                 .style('opacity', 0.4);

                                               d3.select('#linea' + datapoint)
                                                 .attr('stroke','blue')
                                                 .attr('stroke-width', '3px')
                                               })
        .on('mouseout', function (datapoint, i) {d3.select(this)
                                                 .style('opacity', 1);

                                              d3.select('#linea' + datapoint)
                                                .attr('stroke', color[i])
                                                .attr('stroke-width', '2px')
                                               })
        .on('click', function (datapoint, i) {d3.select('#linea' + datapoint)
                                                .remove();

                                              d3.selectAll("."+datapoint)
                                                .remove()})
        .on('dblclick', function (datapoint, i) {createLinea(data, datapoint, color[i]);})
        .attr("class", "textselected")
        .attr("font-family", "FontRegular")
        .style("text-anchor", "start")
        .style("font-size", 10)

  var arrayCampi = ['BENZENE', 'NO2', 'O3', 'PM10', 'PM25']

  createLinea(data, arrayCampi[0], color[0])
  createLinea(data, arrayCampi[1], color[1])
  createLinea(data, arrayCampi[2], color[2])
  createLinea(data, arrayCampi[3], color[3])
  createLinea(data, arrayCampi[4], color[4])
 // createLinea(data, arrayCampi[5], color[5])
//  createLinea(data, arrayCampi[6], color[6])
//  createLinea(data, arrayCampi[7], color[7])
//  createLinea(data, arrayCampi[8], color[8])
  /*for (i = 0; i < arrayCampi.length; i++){
        createLinea(data, arrayCampi[i], color[i])
    }*/
//createLineaLimite(data, 50, 'aqua')
})



function createLineaLimite(data, limite, colore){
    var dateArray = dataArray(data)
    var retweetArray = retweetArray_(data)

    xDomain = d3.extent(data, function(d) {return new Date(d.day); })
    xScale = d3.scaleTime().domain(xDomain).range([20,lenX]);

    yScale = d3.scaleLinear().domain([0,Math.max.apply(null,retweetArray)]).range([lenY,20]);//d3.scaleLinear().domain([0,Math.max.apply(null, retweetArray)]).range([lenY,20]);
    //var yScale = d3.scaleLog().domain([ 1, yScale_(101000)]).range([lenY,20]);

    var tweetLine = d3.line()
                    .x(function(d) {return xScale(new Date(d.day));})
                    .y(function(d) {return yScale(limite);});

    svg_2
        .append("path")
        .attr('id', 'linea'+limite.toString())
        .attr("d", tweetLine(data))
        .attr("fill", "none")
        .attr("stroke", colore)
        .attr("stroke-width", 1)
        .attr('opacity', 0.3)


};

function createLinea(data, campo, colore){
   var dateArray = dataArray(data)
   var retweetArray = retweetArray_(data)

   xDomain = d3.extent(data, function(d) {return new Date(d.day); })
   xScale = d3.scaleTime().domain(xDomain).range([20,lenX]);

   yScale = d3.scaleLinear().domain([0,Math.max.apply(null, retweetArray)]).range([lenY,20]);
   //var yScale = d3.scaleLog().domain([ 1, yScale_(101000)]).range([lenY,20]);

    var tweetLine = d3.line()
                    .x(function(d) {return xScale(new Date(d.day));})
                    .y(function(d) {return yScale(d[campo]);});

    svg_2
        .append("path")
        .attr('id', 'linea'+campo)
        .attr("d", tweetLine(data))
        .attr("fill", "none")
        .attr("stroke", colore)
        .attr("stroke-width", 2)
        .attr('opacity', 0.5)
        .on('mouseover', function (d){d3.select('#linea'+campo)
                                        .attr('stroke','blue')
                                        .attr('stroke-width', '3px')})
        .on('mouseout', function (d){d3.select('#linea'+campo)
                                        .attr('stroke',colore)
                                        .attr('stroke-width', '2px')});


    svg_2.selectAll("circle."+campo)
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "tweets")
     .attr("r", 2.5)
     .attr("cx", function(d) {return xScale(new Date(d.day))})
     .attr("cy", function(d) {return yScale(d[campo])})
     .style("fill", colore)
     .attr('opacity', 0.2)
     .on('mouseover', overPoint)
     .on('mouseout', awayPoint)
     ;
}


function overPoint(datapoint){
    var dateArray = dataArray(datapoint)
    var retweetArray = retweetArray_(datapoint)
    xScale = d3.scaleTime().domain(xDomain).range([20,lenX]);
    yScale = d3.scaleLinear().domain([0,Math.max.apply(null, retweetArray)]).range([lenY,20]);

    d3.select(this)
      .each(function(p,i){
                 d3.select(this)
                   .attr('r', '4px')})

    lineGenerator = d3.line();

    svg_2//select(this)
      .append('path')
      .attr('id', 'lineeCoordx')
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [d3.select(this).attr('cx'),d3.select(this).attr('cy')]]))
      .attr('stroke', 'black')
      .transition()
      .duration(1000)
      .attr('d', lineGenerator([[d3.select(this).attr('cx'),d3.select(this).attr('cy')],
                                [20, d3.select(this).attr('cy')]]))
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
                                [d3.select(this).attr('cx'), lenY]]))
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
      .attr('r', '2.5px')

}