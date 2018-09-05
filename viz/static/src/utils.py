import pandas as pd
import numpy as np
import datetime
import math
import copy

def circlePoints(x, r, cx, cy):
    return math.sqrt(math.pow(r,2) - math.pow(x-cx, 2)) + cy


agenti_format = [
          {'linea':[[0, 0], [6*13, circlePoints(6*13, 10*13, 0, 0)]],
          'agente': 'CO',
          'mediaCentraline': 50},
          {'linea':[[0, 0], [9*13, circlePoints(9*13, 10*13, 0, 0)]],
          'agente': 'NOX',
          'mediaCentraline': 100},
          {'linea':[[0, 0], [9*13, - circlePoints(9*13, 10*13, 0, 0)]],
          'agente': 'NO2',
          'mediaCentraline': 100},
         {'linea':[[0, 0], [6*13, - circlePoints(6*13, 10*13, 0, 0)]],
          'agente': 'BENZENE' ,
          'mediaCentraline': 20},
          {'linea':[[0, 0], [0*13, - circlePoints(0*13, 10*13, 0, 0)]],
          'agente': 'SO2',
          'mediaCentraline': 300},
          {'linea':[[0, 0], [-5*13, - circlePoints(-5*13, 10*13, 0, 0)]],
          'agente': 'O3',
          'mediaCentraline': 33},
          {'linea':[[0, 0], [-9*13, - circlePoints(-9*13, 10*13, 0, 0)]],
          'agente': 'PM2.5',
          'mediaCentraline': 23.20},
          {'linea':[[0, 0], [-9*13, circlePoints(-9*13, 10*13, 0, 0)]],
          'agente': 'PM10',
          'mediaCentraline': 89},
         {'linea':[[0, 0], [-5*13, circlePoints(-5*13, 10*13, 0, 0)]],
          'agente': 'NO',
          'mediaCentraline': 40}]

def year_average(df, inquinante, limite):
    df_media_1 = (df[df['inquinante']==inquinante].groupby('anno').mean()/limite*100).T
    df_media_1.drop(['ora'], inplace=True)
    df_media_1.columns = ['2018']
    
    return df_media_1

def hour_average(df, inquinante, limite):
    df_media_2 = pd.DataFrame(df[df['inquinante']==inquinante].mean()/limite*100)
    df_media_2.drop(['anno','ora'], inplace=True)
    df_media_2.columns = ['2018']
    
    return df_media_2

def daily_average(df, inquinante, limite):
    df_media_4 = pd.DataFrame((df[df['inquinante']==inquinante]
                               .sort_values('data_ora')
                               .groupby([pd.to_datetime(df['data_ora']).dt.date])
                               .mean()/limite*100).mean())
    df_media_4.drop(['anno','ora'], inplace=True)
    df_media_4.columns = ['2018']
    
    return df_media_4

def bubble_data(df, anno):
    """Returns the file name to be read by the html"""

    df_total_average = pd.DataFrame([year_average(df, 'BENZENE', 5)['2018'],
              hour_average(df, 'O3', 180)['2018'],
              hour_average(df, 'NO2', 200)['2018'],
              daily_average(df, 'PM10', 50)['2018'], 
             year_average(df, 'PM2.5', 25)['2018']]).mean(skipna=True)

    data_bubbles = []
    for centralina, valore in df_total_average.iteritems():
        data_bubbles += [{'nome': centralina,
                          'size': valore}]

    with open('static/data/default_bubble_' + str(anno) + '.js', 'w') as f:
        f.write('var centraline = ')
        f.write(str(data_bubbles) + '\n')


    return df, 'data/default_bubble_' + str(anno) + '.js', df_total_average.index





def radar_data(df_selected, agenti, anno, lista_centraline):

	df_agente_giorno = df_selected.groupby(
		['Chimico', pd.to_datetime(df_selected['Date']).dt.date]).sum()

	dizionario_centraline = {}

	for centr in lista_centraline:
		dizionario_centraline[centr] = copy.deepcopy(agenti_format)

		for idx, info_agente in enumerate(dizionario_centraline[centr]):
			chimico = dizionario_centraline[centr][idx]['agente']
			dizionario_centraline[centr][idx]['mediaCentraline'] = \
			df_agente_giorno[centr][chimico].mean()

	tutte_agenti = df_selected.groupby(
		['Chimico', pd.to_datetime(df_selected['Date']).dt.date]).sum()[
		lista_centraline].mean(axis=1)
	dizionario_centraline['tutte'] = copy.deepcopy(agenti_format)
	for valore in dizionario_centraline['tutte']:
		chimico = valore['agente']
		valore['mediaCentraline'] = tutte_agenti[chimico].mean()

	with open('static/data/default_radar_' + str(anno) + '.js', 'w') as f:
		f.write('var agentiChimici = ')
		f.write(str(dizionario_centraline) + '\n')

	nome_file = 'data/default_radar_' + str(anno) + '.js'


	return nome_file


def linee_data(df_selected, anno):


	df_selected['data_mese'] = df_selected.Date.apply(
		lambda x: x[:-11] + '01')
	sub_df = df_selected.groupby(['Chimico', 'data_mese']).sum()

	df_linee = pd.DataFrame()
	df_linee['day'] = sub_df.index.levels[1]

	medie_mensili = sub_df[sub_df.columns[2:-1]].mean(axis=1)
	for inquinante in list(sub_df.index.levels[0]):
		df_linee[inquinante] = medie_mensili[inquinante].values

	nome_file = 'data/linee' + str(anno) + '.csv'
	df_linee.to_csv('static/data/' + nome_file, sep=',', index=None)

	with open('static/data/file_linee_' + str(anno) + '.js', 'w') as f:
		f.write('var nome_file = ')
		f.write('../' + nome_file)

	return nome_file