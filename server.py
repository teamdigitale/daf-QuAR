from flask import Flask
from flask import request
from flask import render_template
from flask import redirect, url_for


import ast
import json
import datetime
import numpy as np
import pandas as pd
from collections import defaultdict


#import static.src.utils
import static.src.write_credentials
from static.src.utils import agenti_format,\
                             dizionario_limite, agenti,\
                             centraline, method_index,\
                             df, inq_objects, current_year
from static.src.plot_utils import bubble_data, radar_data,\
                                  linee_data
    

    
app = Flask(__name__,
			template_folder='templates/',
			static_folder='static/',
			static_url_path='')

@app.route("/")
def home_page():
	return render_template('landingPage.html')

@app.route("/viz-tempo", methods=['GET', 'POST'])
def viz_temporale():
    """This function renders the pages
    related to the temporal viz of the agents"""
	
    if request.method == 'GET':
        # Default page referring to the current year
        anno = current_year
        return render_template('index.html')
    
    # Load the dataset of previous year or already requested to the API
    else: 
        anno = request.form.get("selAnno")
    
    df = pd.read_csv('static/data/pregressi/data_' + anno + '.csv', sep='\t')
    
    """Ottieni i dati da visualizzare con rispetto
    all'anno selezionato dall'utente""" 
    
    
    inquinanti_objects = {inquinante: inq_objects[inquinante].average(df, anno)
                      for inquinante, method in method_index.items()}
    
    print (inquinanti_objects['BENZENE'].columns)
    
    nome = bubble_data(anno, inquinanti_objects)
    nome_radar = radar_data(centraline, agenti_format, inquinanti_objects)
    nome_linee = linee_data(df, inq_objects)
    
    return render_template('index.html')
    #return redirect(url_for('index.html'))
    
    
    #render_template('index.html')
	#return render_template('index_selection.html',
#						   nome=nome,
#						   name_file_radar=nome_radar,
#						   name_file_linee=linee_data(df_selected,
#													  anno))#,name_file_linee=)

@app.route("/viz-mappa")
def viz_mappa():
	return render_template('mappa.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')