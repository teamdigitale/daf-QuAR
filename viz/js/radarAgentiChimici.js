svg = d3.select("#radar-container")
        .append("svg")
        .attr('width', '30%')
        .attr('height', '300px');

var levels = new Array(10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.05);


svg.append("g")
   .attr("id", "agentichimici")
   .attr("class", "groupCircles")
   .attr("transform", "translate(180,160)")
   .selectAll('g')
   .data(levels)
   .enter()
   .append('circle')
   .attr('r', 0)
   .transition()
   .duration(2000)
   .attr('r', function (d) {return d*13;})
   .style("fill", "transparent")
   .style("stroke", "grey")




lineGenerator = d3.line();

svg.append("g")
   .attr('id', "assi-radar")
   .attr('class', "groupAssi")
   .attr("transform", "translate(180,160)")
   .selectAll("g")
   .data(agentiChimici.tutte)
   .enter()
   .append('g')
   .attr('class', 'raggi-radar')


var raggiRadar = d3.selectAll('g.raggi-radar')

raggiRadar.append('path')
          .attr('d', lineGenerator([[0,0],[0,0]]))
          .style('stroke', 'black')
          .transition()
          .duration(2000)
          .attr('d', function (d) {return lineGenerator(d.linea)})
          .style("stroke", "grey");

raggiRadar
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", function (d){return d.linea[1][1] > 0 ? d.linea[1][1] + 10 : d.linea[1][1] - 10})
    .attr("x", function (d){return d.linea[1][0] > 0 ? d.linea[1][0] + 20 : d.linea[1][0] - 20})
    .style("font-size", "10px")
    .text(function(d) {return d.agente;});



//poligonoPunti[agentiChimici.length+1] = new Array(xCoordinate(agentiChimici[0]), yCoordinate(agentiChimici[0]))



var valoriMedi = agentiChimici.tutte.map(el => el.mediaCentraline)
var maxMediaCentraline = d3.max(agentiChimici.tutte, function(el) {return el.mediaCentraline});
var scaleValoriMedi = d3.scaleLinear().domain([ 0, maxMediaCentraline]).range([0, 10*13]);


function computeLine(y, x1, x2, y1, y2){
    return (y-y1)*(x2-x1)/(y2-y1) + x1
};

function xCoordinate(d){
return d.linea[1][1] > 0 ? computeLine(scaleValoriMedi(d.mediaCentraline),0,d.linea[1][0],0,d.linea[1][1])
                         : computeLine(- scaleValoriMedi(d.mediaCentraline),0,d.linea[1][0],0,d.linea[1][1]);
}

function yCoordinate(d){
return d.linea[1][1] > 0 ? scaleValoriMedi(d.mediaCentraline)
                         : - scaleValoriMedi(d.mediaCentraline);
}


function definePolygon(_agentiChimici, chooseCentralina){
    var poligonoPunti = new Array()

    for (i = 0; i < _agentiChimici[chooseCentralina].length; i++){
        poligonoPunti[i] = new Array(xCoordinate(_agentiChimici[chooseCentralina][i]),
                                     yCoordinate(_agentiChimici[chooseCentralina][i]))
    }
    poligonoPunti[i] = new Array(xCoordinate(_agentiChimici[chooseCentralina][0]),
                                 yCoordinate(_agentiChimici[chooseCentralina][0]))

    return poligonoPunti
}


svg.append("g")
   .attr("id", "area-agenti")
   .attr("class", "groupArea")
   .attr("transform", "translate(180,160)")
   .append('path')
   .attr('d', lineGenerator([[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0], [0,0]]))
   .transition()
   .duration(2000)
   .delay(function(d,i) {return i * 100})
   .attr('d', lineGenerator(definePolygon(agentiChimici, 'tutte')))
   .style("fill", "orange")
   .style("opacity", .5)
   .style("stroke", "orange");



svg.append("g")
   .attr('id', "valori-agenti")
   .attr('class', "group-valori-agenti")
   .attr("transform", "translate(180,160)")
   .selectAll("g")
   .data(agentiChimici.tutte)
   .enter()
   .append('g')
   .attr('class', 'valori-radar')

var puntiRadar = d3.selectAll('g.valori-radar')



puntiRadar
   .append('circle')
   .attr('cx', 0)
   .attr('cy', 0)
   .attr('r', 2)
   .transition()
   .delay(function(d,i) {return i * 100})
   .duration(2000)
   .attr('cx', function (d) {return xCoordinate(d);})
   .attr('cy', function (d) {return yCoordinate(d);})
   .style("fill", "red")
   .style("stroke", "red")

function highlightCentralina(d) {

     d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",true).style('fill','blue'):
          d3.select(this).classed("active",false).style('fill', 'red');
    });

     //d3.selectAll("g.overallG").select("#"+d.nome)
     //  .style("fill", function(p) {return p.nome == d.nome ? "red" : "pink";})
     //  ;

     svg.append("g")
       .attr("id", "area-centralina")
       .attr("class", "groupAreaCentralina")
       .attr("transform", "translate(180,160)")
       .append('path')
       .attr('d', lineGenerator([[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0], [0,0]]))
       .transition()
       .duration(200)
       .delay(function(d,i) {return i * 100})
       .attr('d', lineGenerator(definePolygon(agentiChimici, d.nome)))
       .attr('class', 'areaMomentanea')
       .style("fill", "pink")
       .style("opacity", .6)
       .style("stroke", "black")
       .style('stroke-width', 3);

     svg.append("g")
        .attr('id', "valori-agente-spec")
        .attr('class', "group-valori-agente-spec")
        .attr("transform", "translate(180,160)")
        .selectAll("g")
        .data(agentiChimici[d.nome])
        .enter()
        .append('g')
        .attr('class', 'valori-radar-spec')
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 2)
        .attr('class', 'puntiMomentanei')
        .transition()
        .duration(200)
        .attr('cx', function (d) {return xCoordinate(d);})
        .attr('cy', function (d) {return yCoordinate(d);})
        .style("fill", "red")
        .style("stroke", "red")

    };


function oldCentralina(d) {
     //d3.selectAll("g.overallG").select("#"+d.nome)
     //  .style("fill", function(p) {return this.class == 'active' ? "blue" : 'pink';});

    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",true).style('fill','blue'):
          d3.select(this).classed("active",false).style('fill', 'pink');
    })


    d3.selectAll("g.group-valori-agente-spec").selectAll("circle").each(function(p,i){
        d3.select(this).attr('class') == 'puntiBloccati' ?
            d3.select(this).style('fill','blue'):
            d3.select(this).transition().duration(150).remove()
    });

    d3.selectAll("g.groupAreaCentralina").select("path").each(function(p,i){
        d3.select(this).attr('class') == 'areaBloccata' ?
            d3.select(this).style('fill','blue'):
            d3.select(this).transition().duration(150).remove()
    });
     //d3.selectAll('g.groupAreaCentralina').select('path')
     //  .transition()
     //  .duration(150)
     //  .remove()
    };

function blockCentralina(d) {
    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') != 'active' ?
          d3.select(this).classed("active",true).style('fill','blue'):
          d3.select(this).classed("active",true).style('fill', 'blue');
    })

    d3.selectAll('g.groupAreaCentralina').select('path')
       .classed('areaMomentanea', false)
       .classed('areaBloccata', true).style('fill', 'blue')

    d3.selectAll("g.group-valori-agente-spec").selectAll('circle')
       .classed('puntiMomentanei', false)
       .classed('puntiBloccati', true).style('fill', 'blue')

    //d3.selectAll("g.groupAreaCentralina").select("path").each(function(p,i){
    //    d3.select(this).attr('class') == 'areaBloccata' && d3.selectAll('g.overallG').select('circle').each(function(t,j){return d3.select(this).attr('class') != 'active'})?
    //        d3.select(this).classed('areaBloccata', false).transition().duration(150).remove()://style('fill', 'blue'):
    //        d3.select(this).classed('areaBloccata', true).style('fill','blue')
    //});




    //d3.selectAll("g.overallG").select("#"+d.nome)
       //.style("fill", function(p) {return p.nome == d.nome ? "blue" : "pink";})
    //   .classed('active', true)
    //   .style('fill', 'blue');
};

function unblockCentralina(d) {
    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",false).style('fill','pink'):
          d3.select(this).classed("active",true).style('fill', 'blue');
    })

    d3.selectAll('g.groupAreaCentralina').select('path')
       .classed('areaBloccata', false).transition().duration(150).remove()
       //.classed('areaBloccata', true).style('fill', 'blue')

    d3.selectAll('g.group-valori-agente-spec').selectAll('circle')
       .classed('puntiBloccati', false).transition().duration(150).remove()

    //d3.selectAll("g.groupAreaCentralina").select("path").each(function(p,i){
    //    d3.select(this).attr('class') == 'areaBloccata' && d3.selectAll('g.overallG').select('circle').each(function(t,j){return d3.select(this).attr('class') != 'active'})?
    //        d3.select(this).classed('areaBloccata', false).transition().duration(150).remove()://style('fill', 'blue'):
    //        d3.select(this).classed('areaBloccata', true).style('fill','blue')
    //});




    //d3.selectAll("g.overallG").select("#"+d.nome)
       //.style("fill", function(p) {return p.nome == d.nome ? "blue" : "pink";})
    //   .classed('active', true)
    //   .style('fill', 'blue');
};