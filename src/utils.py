import re
import requests
import datetime
import numpy as np
import pandas as pd


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
    #print (text_r)
 
    lines = text_r.strip().split('\n')
    #print ('len df: ',len(lines))
        
    return pd.DataFrame(lines[:], columns=[lines[0]])

def download_data(base_url,
                  lista_anni,
                  lista_agenti_chimici):
    """Return the df of air quality in Rome"""
    
    lista_df = []
    columns = ['jd', 'h', '2', '3', '5',
               '8', '10', '11', '14', '15',
               '16', '39', '40',
               '41', '45', '47', '48', '49',
               '55', '56', '57', '60', '83', 
               '84', '85', '86', '87', 'Anno',
               'Chimico']

    for chimico in lista_agenti_chimici:
        for anno in lista_anni:
            print (chimico, anno)
            r = requests.get(compose_url(base_url, anno, chimico))
            #print (compose_url(base_url, anno, chimico))
            df = write_response(r)

            columns_ = df.iloc[0].index[0]
            clean_columns = [item.strip()\
                             for item in columns_.split(' ')\
                             if len(item)!=0]
            #cols = clean_columns + new_columns

            list_rows = []
            for line_idx in range(1, len(df)):
                scarto_cols = len(columns)-len(clean_columns)-2
     
                line = df.iloc[line_idx].values[0].strip().split(' ')
                raw_line = [item for item in line if len(item)!=0] 
                if len(raw_line) == len(columns)-2:
                    list_rows += [raw_line + [anno, chimico]]
                else:
                    raw_line += ['Centralina non esistente']*(scarto_cols)
                    list_rows += [raw_line + [anno, chimico]]

            df_idx = pd.DataFrame(list_rows, columns=columns)
            lista_df += [df_idx]

    df_final = pd.concat(lista_df, ignore_index=True)
    
    return df_final

def convert_date(anno, giorno):
    """Return date instead of day number
    """
    
    inizio_anno = datetime.datetime(int(anno),1,1)
    dtdelta = datetime.timedelta(days=int(giorno)-1)
    
    return inizio_anno + dtdelta

def convert_coordinates(x):
    """Return right coordinate format
    """
    
    long = x.replace('.',',')
    rep = re.sub('(,[^,]*),', r'\1', long)
    rep = rep.replace(',','.')
    return rep

def update_dati(lista_agenti_chimici, base_url):
    """Return the new data"""
    
    lista_df = []
    columns = ['Giorno_giuliano','Ora','Centralina_2',
               'Centralina_3', 'Centralina_5', 'Centralina_8',
               'Centralina_10', 'Centralina_11', 'Centralina_14',
               'Centralina_15', 'Centralina_16', 'Centralina_39',
               'Centralina_40', 'Centralina_41', 'Centralina_45',
               'Centralina_47', 'Centralina_48', 'Centralina_49',
               'Centralina_55', 'Centralina_56', 'Centralina_57',
               'Centralina_60', 'Centralina_83', 'Centralina_84',
               'Centralina_85', 'Centralina_86', 'Centralina_87',
               'Anno', 'Chimico']
    anno = str(datetime.datetime.now().year)
    
    for chimico in lista_agenti_chimici:
        print (chimico)
        r = requests.get(compose_url(base_url, anno, chimico))
        df = write_response(r)
        
        columns_ = df.iloc[0].index[0]
        clean_columns = [item.strip()\
                         for item in columns_.split(' ')\
                         if len(item)!=0]

        list_rows = []
        for line_idx in range(1, len(df)):
            scarto_cols = len(columns)-len(clean_columns)-2

            line = df.iloc[line_idx].values[0].strip().split(' ')
            raw_line = [item for item in line if len(item)!=0] 
            if len(raw_line) == len(columns)-2:
                list_rows += [raw_line + [anno, chimico]]
            else:
                raw_line += ['Centralina non esistente']*(scarto_cols)
                list_rows += [raw_line + [anno, chimico]]

        df_idx = pd.DataFrame(list_rows, columns=columns)
        lista_df += [df_idx]
        
    df_final = pd.concat(lista_df, ignore_index=True)
    return df_final