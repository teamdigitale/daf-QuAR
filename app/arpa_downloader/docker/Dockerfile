FROM python:3.6

LABEL version="0.0.1"

COPY app/arpa_downloader/docker/requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY src /opt/arpa-downloader/src
COPY main.py /opt/arpa-downloader

WORKDIR /opt/arpa-downloader

RUN mkdir data
#RUN mkdir logs

# da decommentare per l'esecuzione in locale
#COPY vaulted_data/ssh_keys/comune_roma_daf_key /opt/arpa-downloader/config/keys/comune_roma_daf_key
#ENV sftp_host daf.teamdigitale.it
#ENV sftp_user comune_roma_daf
#ENV sftp_key_file ./config/keys/comune_roma_daf_key
#ENV sftp_folder ENVI/misurazioni/dati_chimici_roma/

#CMD python ./main.py --dest_folder ./data --type current --year 2018
CMD python ./main.py