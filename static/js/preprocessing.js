function circlePoints(x, r, cx, cy){
    return Math.sqrt(Math.pow(r,2) - Math.pow(x-cx,2)) + cy
};


function getBubbleSize(data, anno){
    campi_dati = data.columns
    lista_centraline = campi_dati.slice(2,-3)

    centraline = new Array()

    filteredData = data.filter(function(row) {
        return row['Anno'] == anno;
    })


   for (i = 0; i < lista_centraline.length; i++){
             arrayCentralina = filteredData.map(function (d) {return parseFloat(d[lista_centraline[i]])})
                                                               .filter(function (value) {return value >= 0})
             lengthCentralina = arrayCentralina.length
             sizeBubble =  arrayCentralina.reduce(function (tot, sum) {return tot+sum}) / lengthCentralina

             centraline[i] = {'nome': lista_centraline[i],
                              'size': sizeBubble}

        }

   return centraline
}

function getValoriCentraline(data, anno){
    filteredData = data.filter(function(row) {
        return row['Anno'] == anno;
    })

    var dataByChimico = d3.nest()
                           .key(function(d) { return d.Giorno_giuliano; })
                           .key(function(d) { return d.Chimico; })
                           .rollup(function (v) {return d3.sum(v, function(d, i) { keys = Object.keys(d)
                                                                                   filterKey = keys.slice(2,-3)


                                                                                   keysOfInterest = []
                                                                                   valuesCentraline = []
                                                                                   for (i = 0; i < filterKey.length; i++) {
                                                                                                        if (parseFloat(d[filterKey[i]]) >= 0){
                                                                                                            keysOfInterest.push(filterKey[i])
                                                                                                            valuesCentraline.push(parseFloat(d[filterKey[i]]))
                                                                                                            }
                                                                                        }

                                                                                 return valuesCentraline.length > 0 ? valuesCentraline.reduce((a, b) => a + b):
                                                                                        0

                                                                                                })



                                                                                ;})

                           .entries(filteredData);

    console.log(dataByChimico)

    dayChimicoAvg = {'BENZENE':[],
                     'CO': [],
                     'NO2': [],
                     'NOX': [],
                     'NO': [],
                     'O3': [],
                     'PM10': [],
                     'PM2.5': [],
                     'SO2': []}

    agentiChimiciList = ['BENZENE', 'CO', 'NO2', 'NOX', 'NO', 'O3', 'PM10', 'PM2.5', 'SO2']

    for (i = 0; i < dataByChimico.length; i++){

            for (j = 0; j < dataByChimico[i].values.length; j++) {
                agente = dataByChimico[i].values[j].key
                valore = dataByChimico[i].values[j].value

                dayChimicoAvg[agente] = dayChimicoAvg[agente].concat(valore)
            }

    }


    dayChimicoFinal = {'BENZENE':[],
                     'CO': [],
                     'NO2': [],
                     'NOX': [],
                     'NO': [],
                     'O3': [],
                     'PM10': [],
                     'PM2.5': [],
                     'SO2': []}

    for (i = 0; i < agentiChimiciList.length; i++){
            arrayChimico = dayChimicoAvg[agentiChimiciList[i]]
            dayChimicoFinal[agentiChimiciList[i]] = arrayChimico.reduce((a,b) => a + b)/arrayChimico.length
    }

  return dayChimicoFinal
}

function finalValoriChimici(agentiChimici, dayChimicoFinal){

    for (var key in agentiChimici) {
        if (agentiChimici.hasOwnProperty(key) && key != 'tutte') {
            centralina = agentiChimici[key]
            for (i = 0; i < centralina.length; i++){

                if (centralina[i].agente != 'Totale'){
                centralina[i].mediaCentraline = dayChimicoFinal[centralina[i].agente]

                console.log(agentiChimici)
                }

            }
        }
    }



}