import datetime
import numpy as np
import pandas as pd

from src.utils import update_dati,\
                      convert_date
    

lista_agenti_chimici = ['BENZENE', 'CO', 'NO2', 
                        'NOX', 'NO', 'O3',
                        'PM10', 'PM2.5', 'SO2']

base_url = 'http://www.arpalazio.net/main/aria/sci/annoincorso/chimici/RM/DatiOrari/RM_'

df_final = update_dati(lista_agenti_chimici, base_url)
df_final['Date'] = np.vectorize(convert_date)(df_final['Anno'], df_final['Giorno_giuliano'], df_final['Ora'])

old_df = pd.read_csv('data/air_pollution_pregressa.tsv', sep='\t')
df_update = pd.concat([old_df, df_final])
df_update.drop_duplicates(subset=list(df_final.columns), inplace=True, keep='last')

df_update.to_csv('data/air_pollution_updated.tsv', sep='\t', index=None)