while true; do
read -p "Do you wish to clear cache?" yn
case $yn in
    [Yy]* ) watchman watch-del-all && rm -rf $TMPDIR/react-native-packager-cache-* && rm -rf $TMPDIR/metro-bundler-cache-* && rm -rf node_modules/ && yarn cache clean && yarn install && yarn start -- --reset-cache; break;;
    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
esac
done