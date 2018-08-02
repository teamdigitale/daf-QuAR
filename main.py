import pandas as pd
import numpy as np

from src.utils import download_data,\
                     convert_date
    
    
lista_anni = ['2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', 
              '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', 
              '1999']
lista_inquinanti = ['BENZENE', 'CO', 'NO2', 'NOX', 'NO', 'O3', 'PM10', 'PM2.5', 'SO2']

base_url_anno_corrente = 'http://www.arpalazio.net/main/aria/sci/annoincorso/chimici/RM/DatiOrari/RM_'
base_url_storico = 'http://www.arpalazio.net/main/aria/sci/basedati/chimici/BDchimici/RM/DatiOrari/RM_'

df_final = download_data(base_url_storico, lista_anni, lista_inquinanti)
                  
# Aggiungo una nuova colonna data_ora che normalizza anno, giorno e ora
df_final['data_ora'] = np.vectorize(convert_date)(df_final['Anno'], df_final['jd'], df_final['h'])

# Rinomino le colonne
df_final.rename(inplace=True,index=str, columns={"jd": "Giorno_giuliano", 
                                                 "h": "Ora",
                                                 "1": 'Centralina_1',
                                                 "2": 'Centralina_2',
                                                 "3": 'Centralina_3',
                                                 "4": 'Centralina_4',
                                                 '5': 'Centralina_5',
                                                 "6": 'Centralina_6',
                                                 "7": 'Centralina_7', 
                                                 '8': 'Centralina_8',
                                                 "9": 'Centralina_9',
                                                 '10': 'Centralina_10',
                                                 '11': 'Centralina_11',
                                                 "13": 'Centralina_13',
                                                 '14': 'Centralina_14',
                                                 '15': 'Centralina_15',
                                                 '16': 'Centralina_16',
                                                 "38": 'Centralina_38',
                                                 '39': 'Centralina_39',
                                                 '40': 'Centralina_40',
                                                 '41': 'Centralina_41',
                                                 '45': 'Centralina_45',
                                                 '47': 'Centralina_47',
                                                 '48': 'Centralina_48',
                                                 '49': 'Centralina_49',
                                                 '55': 'Centralina_55',
                                                 '56': 'Centralina_56',
                                                 '57': 'Centralina_57',
                                                 '60': 'Centralina_60',
                                                 '83': 'Centralina_83',
                                                 '84': 'Centralina_84',
                                                 '85': 'Centralina_85',
                                                 '86': 'Centralina_86',
                                                 '87': 'Centralina_87'})

print('Download completed. Exporting to csv')

csv_filename = 'data/air_pollution_pregressa_{}.csv'.format(int(pd.Timestamp.timestamp(pd.Timestamp.now())))
df_final.to_csv(csv_filename, sep='\t', index=None)
print('csv file created: {}'.format(csv_filename))

# TODO: upload to sftp