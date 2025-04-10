#!/bin/sh
set -e

#install and build model service
cd packages/model-service;
echo "Installing model service...";
yarn install;
yarn build;

#install and build generator-langium-model-management
cd ../../packages/generator-langium-model-management;
echo "Installing generator-langium-model-management...";
yarn install;
yarn build;

#install and build workflow blended modeling example
cd ../../examples-al/workflow/server-blended-modeling;
echo "Installing workflow blended modeling example...";
yarn install;
cd ../glsp-vscode-integration;
echo "Installing workflow blended modeling example glsp-vscode-integration...";
yarn install;

#install and build biguml blended modeling example
cd ../../biguml;
echo "Installing biguml blended modeling example...";
yarn install;

#install and build workflow example
cd ../../examples-dj/workflow-example/packages/workflow-server;
echo "Installing workflow example...";
yarn install;
cd ../glsp-vscode-integration;
echo "Installing workflow example glsp-vscode-integration...";
yarn install;

#install and build biguml example
cd ../../../biguml-example;
echo "Installing biguml example...";
yarn install;

cd ../..;