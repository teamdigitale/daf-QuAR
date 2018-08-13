svg = d3.select("#radar-container")
        .append("svg")
        .attr('width', '100%')
        .attr('height', '300px');

var levels = new Array(10,  8, 6, 4, 2,  0.05);
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
    .text(function(d) {return d.agente.split('_').length == 2 ?  d.agente.split('_')[0] +  d.agente.split('_')[1] :
                                                                 d.agente.split('_')[0] ;})
    .on('mouseover', function (d){
                        div.transition()
                          .duration(200)
                          .style("opacity", .9);

                        div	.html(function () {return d.agente.split('_').length == 2 ? '<b> Agente chimico: </b>' + d.agente.split('_')[0] + "<sub>"+ d.agente.split('_')[1]+ "</sub>" + "<br/> <b>Valore medio (u.m.):</b> "  + d.mediaCentraline :
                                                       '<b> Agente chimico: </b>' + d.agente.split('_')[0] +  "<br/> <b>Valore medio (u.m.):</b> "  + d.mediaCentraline}

                        )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                          })
    .on("mouseout", function(d) {
            div.transition()
               .duration(500)
               .style("opacity", 0);
        });




var valoriMedi = agentiChimici.tutte.map(el => el.mediaCentraline)
var maxMediaCentraline = d3.max(agentiChimici.tutte, function(el) {return el.mediaCentraline});
var scaleValoriMedi = d3.scaleLinear().domain([ 0, maxMediaCentraline]).range([1, 4*13]);
var scaleValoriMediLog = d3.scaleLog().domain([ 1, scaleValoriMedi(maxMediaCentraline)]).range([0, 40]);


function computeLine(y, x1, x2, y1, y2){
    return (y-y1)*(x2-x1)/(y2-y1) + x1
};

function xCoordinate(d){
return d.linea[1][1] > 0 ? computeLine(scaleValoriMediLog(scaleValoriMedi(d.mediaCentraline)),0,d.linea[1][0],0,d.linea[1][1])
                         : computeLine(- scaleValoriMediLog(scaleValoriMedi(d.mediaCentraline)),0,d.linea[1][0],0,d.linea[1][1]);
}

function yCoordinate(d){
return d.linea[1][1] > 0 ? scaleValoriMediLog(scaleValoriMedi(d.mediaCentraline))
                         : - scaleValoriMediLog(scaleValoriMedi(d.mediaCentraline));
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
   .style("fill", "#d95f02")
   .style("opacity", .6)
   .style("stroke", "#b36200")
   .style("stroke-width", "2px");



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
   .attr('r', 1)
   .transition()
   .delay(function(d,i) {return i * 100})
   .duration(2000)
   .attr('cx', function (d) {return xCoordinate(d);})
   .attr('cy', function (d) {return yCoordinate(d);})
   .style("fill", "#d95f02")
   .style("stroke", "#d95f02")

function highlightCentralina(d) {

     d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",true).style('fill','#b2df8a'):
          d3.select(this).classed("active",false).style('fill', '#a6cee3');
    });


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
       .style("fill", "#1f78b4")
       .style("opacity", .6)
       .style("stroke", "#1f78b4")
       .style('stroke-width', 2);

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
        .attr('r', 1)
        .attr('class', 'puntiMomentanei')
        .transition()
        .duration(200)
        .attr('cx', function (d) {return xCoordinate(d);})
        .attr('cy', function (d) {return yCoordinate(d);})
        .style("fill", "#a6cee3")
        .style("stroke", "#a6cee3")

    };


function oldCentralina(d) {

    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",true).style('fill','#b2df8a').style("stroke", "#b2df8a"):
          d3.select(this).classed("active",false).style('fill', '#1f78b4').style("stroke", "#1f78b4");
    })


    d3.selectAll("g.group-valori-agente-spec").selectAll("circle").each(function(p,i){
        d3.select(this).attr('class') == 'puntiBloccati' ?
            d3.select(this).style('fill','#b2df8a').style("stroke", "#b2df8a"):
            d3.select(this).transition().duration(150).remove()
    });

    d3.selectAll("g.groupAreaCentralina").select("path").each(function(p,i){
        d3.select(this).attr('class') == 'areaBloccata' ?
            d3.select(this).style('fill','#b2df8a').style("stroke", "#b2df8a"):
            d3.select(this).transition().duration(150).remove()
    });

    };

function blockCentralina(d) {
    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') != 'active' ?
          d3.select(this).classed("active",true).style('fill','#b2df8a').style("stroke", "#b2df8a"):
          d3.select(this).classed("active",true).style('fill', '#b2df8a').style("stroke", "#b2df8a");
    })

    d3.selectAll('g.groupAreaCentralina').select('path')
       .classed('areaMomentanea', false)
       .classed('areaBloccata', true).style('fill', '#b2df8a').style("stroke", "#b2df8a")

    d3.selectAll("g.group-valori-agente-spec").selectAll('circle')
       .classed('puntiMomentanei', false)
       .classed('puntiBloccati', true).style('fill', '#b2df8a').style("stroke", "#b2df8a")

};

function unblockCentralina(d) {
    d3.select(this).select('circle').each(function(p,i) {
      d3.select(this).attr('class') == 'active' ?
          d3.select(this).classed("active",false).style('fill','#1f78b4'):
          d3.select(this).classed("active",true).style('fill', '#b2df8a');
    })

    d3.selectAll('g.groupAreaCentralina').select('path')
       .classed('areaBloccata', false).transition().duration(150).remove()
       //.classed('areaBloccata', true).style('fill', '#b2df8a')

    d3.selectAll('g.group-valori-agente-spec').selectAll('circle')
       .classed('puntiBloccati', false).transition().duration(150).remove()

};