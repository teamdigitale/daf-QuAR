# ARPA Lazio Downloader 

## Abstract
Questo componente esegue lo scarico dei dati relativi agli inquinanti dell'aria dai file testuali pubblicati quotidianamente dalla *Rete Automatica di Qualità dell'Aria* di ARPA Lazio aggregandoli in un unico file csv. La documentazione completa dei dati è disponibile qui: http://www.arpalazio.net/main/aria/sci/annoincorso/chimici.php 

Sono fornite di seguito le indicazioni per la costruzione dell'immagine Docker e l'avvio del container, e per il deploy su Kubernetes. Per la logica di scarico vedere [main.py](../../main.py)


## Docker

Per l'esecuzione sono necessarie le seguenti variabili d'ambiente, impostabili nel Dockerfile o passabili al lancio del container:
- `sftp_host` host sftp del DAF sul quale caricare i dati
- `sftp_user` utente sftp che effettua il caricamento (deve essere stato abilitato dal DAF)
- `sftp_key_file` chiave privata per l'accesso a sftp (la chiave pubblica deve essere stata comunicata al DAF)
- `sftp_folder` cartella di destinazione del file su sftp

Dopo aver eventualmente modificato il [Dockerfile](./docker/Dockerfile), costruire l'immagine docker posizionandosi nella root del progetto con il comando 

    `sudo docker build -t arpa-downloader:0.0.1 -f app/arpa_downloader/docker/Dockerfile .`


Il processo di build aggiunge le librerie python necessarie al funzionamento dell'applicazione ed elencate nel file [requirements.txt](./docker/requirements.txt) oltre al codice python.

All'avvio del container fornire i mapping per i seguenti volumi:
- `data` (opzionale) contenente i file temporanei prodotti per la raccolta dei dati fino al richiamo di tutte le pagine
- `logs` (opzionale) contenente i log prodotti (da implementare)


Se le variabili di ambiente sono state impostate nel Dockerfile, lanciare il container docker con i soli mapping dei volumi (se desiderati)

    `sudo docker run -v /path/to/data:/opt/rgs-mop-downloader/data -v /path/to/logs:/opt/rgs-mop-downloader/logs rgs-mop-downloader:0.0.1`

Altrimenti, aggiungere nel comando le variabili necessarie:

    ``

## Kubernetes

La configurazione per il deploy dell'applicazione come CronJob è contenuta del file [arpa-rm.yaml](./kubernetes/arpa-rm.yaml). Controllare le configurazioni e lanciare il comando:

    `kubectl create -f ./app/arpa_downloader/kubernetes/arpa-rm.yaml`