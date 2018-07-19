function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
                }
  var centraline = [{'nome':'A', 'size':10, 'CO2': 2}, {'nome':'B', 'size':5, 'CO2': 2},
                    {'nome':'C', 'size':8, 'CO2': 4}, {'nome':'D', 'size':12.4, 'CO2': 5},
                    {'nome':'E', 'size':13, 'CO2': 1}, {'nome':'F', 'size':15, 'CO2': 3},
                    {'nome':'G', 'size':13, 'CO2': 6}, {'nome':'H', 'size':18, 'CO2': 12},
                    {'nome':'I', 'size':5.3, 'CO2': 13}]

  var maxSize = d3.max(centraline, function(el) {return el.size});
  var sizeScale = d3.scaleLinear().domain([ 0, maxSize ]).range([ 0, 30 ]);

  d3.select("svg")
    .append("g")
    .attr("id", "centraline")
    .attr("transform", "translate("+window.innerWidth/1.9+","+ window.innerHeight/8+")")
    .selectAll("g")
    .data(centraline)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", function (d,i) {return "translate(" + (i * sizeScale(maxSize) * 2) + ", 10)"});

  var centralina = d3.selectAll("g.overallG");

  centralina
    .append("circle")
    .attr("r", 0)
    .attr('id', function(d) {return d.nome})
    .transition()
    .delay(function(d,i) {return i * 100})
    .duration(500)
    .attr("r", function (d) {return sizeScale(d.size);})
    .style("fill", "pink")
    //.style("stroke", "black")
    .style("stroke-width", "1px");

  centralina
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", maxSize*2+5)
    .attr('transform', 'rotate(-45)')
    .style("font-size", "10px")
    .text(function(d) {return d.nome;});


  centralina.on("mouseover", highlightCentralina);
  centralina.on("mouseout", oldCentralina);
  centralina.on("click", blockCentralina);
  centralina.on("dblclick", unblockCentralina)



  var buttonSort = new Array(['Totale agenti chimici']) //centraline.map(a => a.nome);

  d3.select("#bubble-container")
    .selectAll("button.centraline")
    .data(buttonSort)
    .enter()
    .append("button")
    .on("click", buttonSorting)
    .html(function(d) {return d;});

  function buttonSorting(datapoint) {
        var filteredCentraline = centraline.filter(function (p) {return p.nome == datapoint})
        var sorted_centraline = centraline.sort(dynamicSort('size'))
        var sortCentraline = sorted_centraline.map(a => a.nome)

        centralina
          .attr("transform", function (d,i) {return "translate(" + (i * sizeScale(maxSize) * 2) + ", 0)"})
          .transition()
          .delay(function(d,i) {return i * 100})
          .duration(500)
          .attr("transform",
                function (d,i) {
                        return "translate(" + (sortCentraline.indexOf(d.nome) * sizeScale(maxSize) * 2) + ", 0)"});
     };