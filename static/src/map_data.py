import pandas as pd


from static.src.inquinanti import Inquinante
from static.src.plot_utils import colore_centralina


def color_bubbles(df, anno, dizionario_limite, method_index, centraline, inq_objects):
    """This returns the bubble colors and the centraline's value.
    :df:
    :anno:
    :dizionario_limite:
    :method_index:
    :centraline:
    :inq_objects:
    """
    # Compute the df for each pollutant
    BENZENE = Inquinante('BENZENE', 
                         dizionario_limite['BENZENE'],
                         method_index['BENZENE']).average(df, anno)#year_average(df, 'BENZENE', dizionario_limite['BENZENE'], '2018')
    BENZENE.columns = ['BENZENE']

    PM25 = Inquinante('PM2.5', 
                      dizionario_limite['PM2.5'], 
                      method_index['PM2.5']).average(df, anno)
    PM25.columns = ['PM2.5']

    O3 = pd.DataFrame({'O3': inq_objects['O3'].pollutant_dataframe(df)\
                                              .sort_values('data_ora')\
                                               .iloc[-1]}).T[centraline]

    NO2 = pd.DataFrame({'NO2': inq_objects['NO2'].pollutant_dataframe(df)\
                                              .sort_values('data_ora')\
                                              .iloc[-1]}).T[centraline]

    PM10 = pd.DataFrame({'PM10': inq_objects['PM10'].pollutant_dataframe(df)\
                                                                 .sort_values('data_ora')\
                                                                 .iloc[-24:][centraline].mean()}).T

    # Set the df
    # Colore pallette
    df_colori = pd.DataFrame(pd.concat([BENZENE.T, 
                                        PM25.T,
                                        O3,
                                        NO2,
                                        PM10]).max())
    df_colori['colori'] = df_colori[0].apply(colore_centralina)
    # Data viz
    colori_dict = {i:df_colori['colori'][i] for i in df_colori['colori'].index}
    valori_dict = {i:df_colori[0][i] for i in df_colori[0].index}

    return colori_dict, valori_dict, [BENZENE.T, PM25.T, O3, NO2, PM10]


def bar_plot(list_df, centraline):
    """Returns data for the tooltip barplot.
    :list_df:
    :centraline:
    """
    
    # Bar plot
    df_bar = pd.DataFrame(pd.concat(list_df)).fillna(0)
    dizInquinanti = {"0": "BENZENE",
                     "1": "NO2",
                     "2": "PM10",
                     "3": "PM2.5",
                     "4": "O3"}
    dizInquinantiInve = {j:i for i,j in dizInquinanti.items()}
    list_bars = {}
    # For each bar, corresponding to a pollutant, associate the value
    for a in centraline:
        list_dict_bar = []
        for row in df_bar[a].index:
            list_dict_bar += [{"n":dizInquinantiInve[row], "v": round(df_bar[a][row],1)}]
        # Formatting for Javascript
        list_bars[a] = [str(list_dict_bar).replace("'", '"')]

    return list_bars

def pie_plot(df, centraline):
    """Returns data fot the tooltip pie.
    :df:
    :centraline:
    """
    
    # Groupby inquinante and giorno
    gb = df.groupby(('data_ora_time', 'inquinante'))
    # Take the avg and keep only the centraline cols
    mean_gb = gb[centraline].mean()
    # Compute the percentage of days of the current year red, green etc
    colors = mean_gb.groupby('data_ora_time').max()\
                                             .applymap(colore_centralina)\
                                             .apply(pd.Series.value_counts)\
                                             .fillna(0)
    percentuali = colors/colors.sum()*100

    # Format data for Javascript
    lista_centrali_2 = {}
    for c in percentuali.columns:
        lista_centrali_2[c] = [{'label': r, 
                                'value': round(percentuali.loc[r][c],2)}
                               for r in percentuali.index]
        
    return lista_centrali_2


