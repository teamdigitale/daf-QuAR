import pandas as pd
import numpy as np

from src.utils import download_data,\
                      convert_date
    
    
lista_anni = ['2018', '2017', '2016', '2015', '2014']
lista_agenti_chimici = ['BENZENE', 'CO', 'NO2', 
                        'NOX', 'NO', 'O3',
                        'PM10', 'PM2.5', 'SO2']

base_url = 'http://www.arpalazio.net/main/aria/sci/annoincorso/chimici/RM/DatiOrari/RM_'

df_final = download_data(base_url,
                  lista_anni,
                  lista_agenti_chimici)
df_final['Date'] = np.vectorize(convert_date)(df_final['Anno'], df_final['jd'], df_final['h'])


df_final.rename(inplace=True,index=str, columns={"jd": "Giorno_giuliano", 
                                                 "h": "Ora",
                                                 "2": 'Centralina_2',
                                                 "3": 'Centralina_3',
                                                 '5': 'Centralina_5', 
                                                 '8': 'Centralina_8',
                                                 '10': 'Centralina_10',
                                                 '11': 'Centralina_11',
                                                 '14': 'Centralina_14',
                                                 '15': 'Centralina_15',
                                                 '16': 'Centralina_16',
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
                                                 '87': 'Centralina_87'
                                                   })

df_final.to_csv('data/air_pollution_pregressa.csv', sep='\t', index=None)