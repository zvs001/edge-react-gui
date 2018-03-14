#!/usr/bin/env bash


#configs
APP_NAME="Bluecoin";
DEFAULT_WALLET="bluecoin"; #should be in lowercase


# set up image at top of login screen
${BASH_SOURCE%/*}/edge-login-ui-rn/make-logo.sh
${BASH_SOURCE%/*}/edge-login-ui-rn/rename.sh

# rename application
react-native-rename $APP_NAME;

# change app icon for android
echo $APP_NAME | yo rn-toolbox:assets --icon "${BASH_SOURCE%/*}/images/bluecoin_icon.png" --android --force;



# change splash screen (onload) for android
echo $APP_NAME | yo rn-toolbox:assets --splash "${BASH_SOURCE%/*}/images/splash_2208.png" --android --force;


# set default wallet
file_to_update='./src/constants/WalletAndCurrencyConstants.js';
sed -r $file_to_update -e 's/wallet:\w+/wallet:'$DEFAULT_WALLET'/g' > $file_to_update.tmp && mv $file_to_update.tmp $file_to_update;
