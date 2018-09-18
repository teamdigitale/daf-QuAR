import math
import json
import copy


import pandas as pd
from collections import defaultdict

from static.src.inquinanti import Inquinante


def colore_centralina(x):
    if x <= 50:
        return 'green'
    elif 51 <= x <= 100:
        return 'gold'
    elif 101 <= x <= 150:
        return 'orange'
    elif 151 <= x <= 200:
        return 'red'
    elif 201 <= x <= 300:
        return 'purple'
    elif x >= 301:
        return 'violet'

def circlePoints(x, r, cx, cy):
    """Ther dunction returns the y coordinate of a 
    circonference's point
    
    :x: x's coordinate value.
    :r: length of the radius.
    :cx: x coordinate of the center.
    :cy: y coordinate of the center."""
    
    return math.sqrt(math.pow(r,2) - math.pow(x-cx, 2)) + cy


agenti_format = [{'linea':[[0, 0], [6*13,  circlePoints(6*13, 10*13, 0, 0)]],
                  'agente': 'NO2',
                  'mediaCentraline': 100},
                 {'linea':[[0, 0], [9*13, - circlePoints(9*13, 10*13, 0, 0)]],
                  'agente': 'BENZENE' ,
                  'mediaCentraline': 20},
                 {'linea':[[0, 0], [0*13, - circlePoints(0*13, 10*13, 0, 0)]],
                  'agente': 'O3',
                  'mediaCentraline': 33},
                 {'linea':[[0, 0], [-9*13, - circlePoints(-9*13, 10*13, 0, 0)]],
                  'agente': 'PM2.5',
                  'mediaCentraline': 23.20},
                 {'linea':[[0, 0], [-6*13, circlePoints(-6*13, 10*13, 0, 0)]],
                  'agente': 'PM10',
                  'mediaCentraline': 89}]

# Save the file
with open('static/data/default_info/agenti_format.json', 'w') as f:
    json.dump(agenti_format, f)
    
    
def bubble_data(anno, inquinanti_objects):
    """Returns the file name to be read by the html
    """
    
    df_total_average = pd.DataFrame([obj[anno] 
                                     for obj in inquinanti_objects.values()]).mean(skipna=True)
    
    
    data_bubbles = []
    for centralina, valore in df_total_average.iteritems():
        data_bubbles += [{'nome': centralina,
                          'size': valore}]

    with open('static/data/default_bubble.js', 'w') as f:
        f.write('var centraline = ')
        f.write(str(data_bubbles) + '\n')
        
        return 'data/default_bubble.js'
    
def radar_data(centraline, agenti_format, inquinanti_objects):
    """Returns the file name to be read by the html
    """


    dizionario_centraline = {}
    # For each centralina
    for centr in centraline:
        # Get the information dictionary
        dizionario_centraline[centr] = copy.deepcopy(agenti_format)

        # For each inquinante
        for idx_inq in range(len(dizionario_centraline[centr])):
            inq = dizionario_centraline[centr][idx_inq]['agente']
            # Compute the average wrt to the centralina
            media = inquinanti_objects[inq].loc[centr][0]
            # Handle NaNs
            if math.isnan(media):
                dizionario_centraline[centr][idx_inq]['mediaCentraline'] = 0
            else:
                dizionario_centraline[centr][idx_inq]['mediaCentraline'] = media

    # Define the total avg of all centraline
    dizionario_centraline['tutte'] = copy.deepcopy(agenti_format)
    for valore in dizionario_centraline['tutte']:
        inq = valore['agente']
        valore['mediaCentraline'] = inquinanti_objects[inq].mean()[0]
    
    
    # Define the values for the threshold limits
    limiti_colori = zip([50, 100, 150, 200, 300], 
                        ['green', 'gold', 'orange', 'red', 'purple'])
    for lim, col in limiti_colori:
        dizionario_centraline['limiti_' + col] = copy.deepcopy(agenti_format)
        for valore in dizionario_centraline['limiti_' + col]:
            inq = valore['agente']
            valore['mediaCentraline'] = lim
        

    with open('static/data/default_radar.js', 'w') as f:
        f.write('var agentiChimici = ')
        f.write(str(dizionario_centraline) + '\n')

    nome_file = 'data/default_radar.js'
    
    return nome_file


def linee_data(df, inq_objects):
    """Returns the file name to be read by the html
    """
    # Crreate month column and groupby polluttant and data
    df['data_mese'] = df.sort_values('data_ora').data_ora.apply(lambda x: x[:-11] + '01')
    sub_df = df.sort_values('data_ora').groupby(['inquinante', 'data_mese'])
    
    # Get the dictionary list of date and inquinanti
    dictionary_inq_e_date = defaultdict(set)
    for i in sub_df.groups.keys():
        dictionary_inq_e_date['inq'].add(i[0])
        dictionary_inq_e_date['date'].add(i[1])
    
    # Create the empty df to return
    index = sorted(dictionary_inq_e_date['date'])
    cols = sorted(dictionary_inq_e_date['inq'])
    df_media = pd.DataFrame(index=index, columns=cols)
    
    # Compute the averege value of the index in wrt the month
    for key, grp in sub_df:
        agente = key[0]
        data = key[1]
        value = inq_objects[agente].average(grp, '2018').mean()[0]
        df_media.loc[data][agente] = value
    
    # Create the dataframe to plot
    df_linee = pd.DataFrame([df_media[i].values for i in df_media.columns]).T
    array_date = [d for d in index if len(d.split('-'))==3]
    df_linee['day'] = array_date

    df_linee.columns = [k.replace('.','') for k in df_media.columns] + ['day']
    df_linee = df_linee[['day'] + [k.replace('.','') for k in df_media.columns]]


    nome_file = 'linee.csv'
    df_linee.to_csv('static/data/' + nome_file, sep=',', index=None)

    return nome_file


