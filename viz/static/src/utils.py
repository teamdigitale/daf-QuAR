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



def bubble_data(df, anno):
	"""Returns the file name to be read by the html"""

	# Subselect the df (it will be the API response)
	df_selected = df[df['Anno'] == int(anno)]

	# Ottieni la somma giornaliera di agenti rilevati
	df_somma_giornaliera = df_selected.groupby(
		[pd.to_datetime(df_selected['Date']).dt.date]).sum()
	# Ottieni la media annuale
	df_media_annuale_totale_giornaliero = df_somma_giornaliera.mean()

	lista_centraline = df_media_annuale_totale_giornaliero.index[2:-1:]
	lista_valori = df_media_annuale_totale_giornaliero.values[2:-1:]

	data_bubbles = []
	for centralina, valore in zip(lista_centraline, lista_valori):
		data_bubbles += [{'nome': centralina,
						  'size': valore}]

	with open('static/data/default_bubble_' + str(anno) + '.js', 'w') as f:
		f.write('var centraline = ')
		f.write(str(data_bubbles) + '\n')


	return df_selected, 'data/default_bubble_' + str(anno) + '.js', lista_centraline


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