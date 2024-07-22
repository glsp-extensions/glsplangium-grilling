#!/bin/sh
set -e

#install and build model service
cd packages/model-service;
yarn install;
yarn build;

#install and build generator-langium-model-management
cd ../../packages/generator-langium-model-management;
yarn install;
yarn build;

#install and build workflow blended modeling example
cd ../../examples-al/workflow/server-blended-modeling;
yarn install;
cd ../glsp-vscode-integration;
yarn install;

#install and build biguml blended modeling example
cd ../../biguml;
yarn install;

#install and build workflow example
cd ../../examples-dj/workflow-example/packages/workflow-server;
yarn install;
cd ../glsp-vscode-integration;
yarn install;

#install and build biguml example
cd ../../../biguml-example;
yarn install;

cd ../..;