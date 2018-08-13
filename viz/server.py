from flask import Flask
from flask import request
from flask import render_template


import pandas as pd
import numpy as np

import static.src.utils
from static.src.utils import bubble_data, radar_data

df = pd.read_csv('static/data/air_pollution_pregressa.tsv', sep='\t')
df.replace(-999.0, np.nan, inplace=True)
agenti = df.Chimico.unique()


app = Flask(__name__,
			template_folder='templates/',
			static_folder='static/',
			static_url_path='')

@app.route("/home", methods=['GET','POST'])
def landing_page():
	#try
	if request.method == 'GET':
		return render_template('index.html')


	anno = request.form.get("selAnno")
	#	return render_template('index.html')
	#except:
	df_selected, nome, lista_centraline = bubble_data(df,
									anno)



	return render_template('index_selection.html',
						   nome=nome,
						   name_file_radar=radar_data(df_selected,
													  agenti,
													  anno,
													  lista_centraline))





if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')