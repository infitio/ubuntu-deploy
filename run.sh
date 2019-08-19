#!/usr/bin/env bash

PROJECT_CODE=$1
TOKEN=$2
STAGE=$3
sudo node main -p $PROJECT_CODE -t $TOKEN -s $3
#sudo node main -p $PROJECT_CODE -t $TOKEN -s 2
#source /opt/python/hello-gromor/run/venv/bin/activate
#sudo node main -p $PROJECT_CODE -t $TOKEN -s 3
