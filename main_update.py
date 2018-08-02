import datetime
import numpy as np
import pandas as pd

from src.utils import update_dati,\
                      convert_date
    
lista_inquinanti = ['BENZENE', 'CO', 'NO2', 'NOX', 'NO', 'O3', 'PM10', 'PM2.5', 'SO2']

base_url_anno_corrente = 'http://www.arpalazio.net/main/aria/sci/annoincorso/chimici/RM/DatiOrari/RM_'

df_final = update_dati(lista_inquinanti, base_url_anno_corrente)

# Aggiungo una nuova colonna data_ora che normalizza anno, giorno e ora
df_final['data_ora'] = np.vectorize(convert_date)(df_final['Anno'], df_final['Giorno_giuliano'], df_final['Ora'])

# Carico il vecchio tsv
old_df = pd.read_csv('data/air_pollution_pregressa.tsv', sep='\t')
# Faccio la union con il nuovo
df_update = pd.concat([old_df, df_final])
# Rimuovo i duplicati
df_update.drop_duplicates(subset=list(df_final.columns), inplace=True, keep='last')

# E aggiorno il tsv
df_update.to_csv('data/air_pollution_updated.tsv', sep='\t', index=None)