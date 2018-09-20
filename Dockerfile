FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:deadsnakes/ppa 
RUN apt-get update 
RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN python3.6 -m pip install pip --upgrade
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y git

RUN git clone https://github.com/CriMenghini/daf-QuAR.git
RUN python3 -m pip install -r daf-QuAR/requirements.txt
RUN npm install -g mapshaper

WORKDIR /daf-QuAR
EXPOSE 80

CMD [ "python3", "./server.py" ]

