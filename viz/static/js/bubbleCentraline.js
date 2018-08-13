var maxSize = d3.max(centraline, function(el) {return el.size});
var sizeScale = d3.scaleLinear().domain([ 0, maxSize ]).range([ 0, 13.5 ]);

d3.select("#bubble-container")
  .append("svg")

  .attr('class', 'svg-bubbles')
    .append("g")
    .attr("id", "centraline")
    .attr("transform", "translate("+'40'+","+ '40' +")")
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

  centralina
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", sizeScale(maxSize))
    .attr('x', sizeScale(maxSize)*2)
    .attr('transform', 'rotate(40)')
    .style("font-size", "6px")
    .text(function(d) {return d.nome;});


  centralina.on("mouseover", highlightCentralina);
  centralina.on("mouseout", oldCentralina);
  centralina.on("click", blockCentralina);
  centralina.on("dblclick", unblockCentralina)



  var buttonSort = new Array(['Sì']) //centraline.map(a => a.nome);

  d3.select("#ordina-centraline")
    .selectAll("button.centraline")
    .data(buttonSort)
    .enter()
    .append("button")
    .attr('id', 'button-ordine')
    .on("click", buttonSorting)
    .html(function(d) {return d;});



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

function buttonSorting() {
    //var filteredCentraline = centraline.filter(function (p) {return p.nome == datapoint})
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



//});






