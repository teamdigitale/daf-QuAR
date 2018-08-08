import re
import requests
import datetime
import numpy as np
import pandas as pd
import pysftp
import os


def compose_url(base_url, anno, chimico):
    """Return the url to scrape from
    
    Arguments:
    """
    
    return base_url + chimico + '_' + anno + '.txt'

def write_response(response):
    """Return the df from that file.
    
    Arguments:
    """
    
    text_r = response.text
    
 	# Individua le righe del file
    lines = text_r.strip().split('\n')
    
    """ Crea df dove ogni linea corrisponde ad una riga del df
     In questa operazione non si ha ancora la divisione per le singole colonne
     questo dipende dalla response della richiesta"""
    return pd.DataFrame(lines[:], columns=[lines[0]])

def download_data(base_url,
                  lista_anni,
                  lista_inquinanti):
    """Return the df of air quality in Rome"""
    
    # Inizializziamo la lista dei df ognuno dei quali corrisponde ad un inquinante
    df_template = pd.DataFrame(columns=['jd','h','1','2','3','4','5','6','7','8','9','10','11','13','14','15','16','38','39','40',
                          '41','45','47','48','49','55','56','57','60','83','84','85','86','87','Anno','Inquinante'])
    lista_df = [df_template]
	
	# Per ogni inquinante
    for chimico in lista_inquinanti:
    	# Per ogni anno
        for anno in lista_anni:
            print('Retrieving {} for year {} from {}'.format(chimico, anno, compose_url(base_url, anno, chimico)))
            
            # Esegui la richiesta
            r = requests.get(compose_url(base_url, anno, chimico))

            # Crea il rispettivo dataframe
            df = write_response(r)
            print('{} rows'.format(len(df)))
			
			# Prendi la linea che corrisponde all'header del df
            columns_ = df.iloc[0].index[0]
            
            """ Individua i nomi delle colonne splittando la stringa che li contiene tutti
            ed escludendo lestringhe vuote ottenute tramite lo split"""
            clean_columns = [item.strip()\
                             for item in columns_.split(' ')\
                             if len(item)!=0]
            
            # aggiungo le colonne Anno e Inquinante
            columns = clean_columns + ['Anno', 'Inquinante']
			
            list_rows = []
            # Per ogni linea del df
            for line_idx in range(1, len(df)):
            	
                # Come nel caso precedente splitto la linea per ottenere le diverse celle
                line = df.iloc[line_idx].values[0].strip().split(' ')
                
                # Quindi ottengo la lista delle celle della riga i-th
                raw_line = [item for item in line if len(item)!=0] 
                
                # Aggiungiamo le colonne anno e inquinante
                list_rows += [raw_line + [anno, chimico]]
			
			# Definiamo il nuovo dataset 
            df_idx = pd.DataFrame(list_rows, columns=columns)
            
            # Creiamo aggiungiamo alla lista di df da concatenare quello appena creato 
            lista_df += [df_idx]

	# Facciamo la union dei df tenendo conto che le colonne possono essere diverse (concat con pandas)
    df_final = pd.concat(lista_df, ignore_index=False)

    # sostituisco i NaN e -999.0 con un valore vuoto
    df_final = df_final.fillna('')
    df_final = df_final.replace(to_replace='-999.0', value='')
    
    return df_final

def convert_date(anno, giorno, ora):
    """Return date instead of day number
    """
    
    inizio_anno = datetime.datetime(int(anno),1,1)
    dtdelta = datetime.timedelta(days=int(giorno)-1)
    oradelta =  datetime.timedelta(hours=int(ora))
    
    return inizio_anno + dtdelta + oradelta

def convert_coordinates(x):
    """Return right coordinate format
    """
    
    long = x.replace('.',',')
    rep = re.sub('(,[^,]*),', r'\1', long)
    rep = rep.replace(',','.')
    return rep

def update_dati(lista_inquinanti, base_url):
    """Return the new data"""
    
    anno = str(datetime.datetime.now().year)
    return download_data(base_url, [anno], lista_inquinanti)

def sftp_upload(sftp_host, sftp_user, sftp_key_file, localpath, remotepath):
        cnopts = pysftp.CnOpts()
        cnopts.hostkeys = None
        cnopts.compression = True
        with pysftp.Connection( host=sftp_host, 
                                username=sftp_user, 
                                private_key=sftp_key_file, 
                                cnopts=cnopts) as sftp:
            folder, filename = os.path.split(localpath)
            rpath = remotepath.strip() + filename
            sftp.put(localpath=localpath, remotepath=rpath, preserve_mtime=False, confirm=True)
            print('File uploaded to SFTP in {}'.format(rpath))