#!/usr/bin/env bash

APP_NAME="Bluecoin"

file_to_update='./node_modules/airbitz-core-js-ui/src/native/components/screens/existingAccout/RecoverPasswordScreenComponent.js';
sed -r $file_to_update -e 's/Edge/'$APP_NAME'/g' > $file_to_update.tmp && mv $file_to_update.tmp $file_to_update;

file_to_update='./node_modules/airbitz-core-js-ui/src/native/components/screens/newAccount/NewAccountWelcomeScreenComponent.js';
sed -r $file_to_update -e 's/Edge/'$APP_NAME'/g' > $file_to_update.tmp && mv $file_to_update.tmp $file_to_update;

file_to_update='./node_modules/airbitz-core-js-ui/src/native/components/screens/newAccount/NewAccountUsernameScreenComponent.js';
sed -r $file_to_update -e 's/Edge/'$APP_NAME'/g' > $file_to_update.tmp && mv $file_to_update.tmp $file_to_update;

file_to_update='./node_modules/airbitz-core-js-ui/src/common/reducers/TermsAndConditinsReducer.js';
sed -r $file_to_update -e 's/Edge/'$APP_NAME'/g' > $file_to_update.tmp && mv $file_to_update.tmp $file_to_update;


echo 'rename finished';