#!/bin/bash

echo "Working on $1"
export DISABLE_VERSIONING=true
cd starrocks/docs
git switch $1
git pull
rm -rf docusaurus/docs
cp -r en docusaurus/docs
rm -rf docusaurus/i18n/zh/docusaurus-plugin-content-docs/current
mkdir -p docusaurus/i18n/zh/docusaurus-plugin-content-docs
cp -r zh docusaurus/i18n/zh/docusaurus-plugin-content-docs/current
sed -i "s/: 'ignore'/: 'throw'/g" docusaurus/docusaurus.config.js
cd docusaurus
yarn install --frozen-lockfile --silent
yarn clear
yarn build
git restore docusaurus.config.js
cd ../../..
