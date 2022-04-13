#!/bin/bash
export IMAGE_VERSION=latest;
export SERVICE=nodejs-graphql;

docker stack rm $SERVICE;
npm run clean-build;
docker build -t skynet.bah.com/microservices/$SERVICE:$IMAGE_VERSION .;
docker stack deploy -c deploy/local/stack.yml $SERVICE;

