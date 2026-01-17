
## Installation

Start installation with basics described here: [Base install](../README.md)

#### IOS
- Install XCode
- In XCode open `/app/HeySpaceMobile/ios` folder as project root
- in terminal enter `/ios` folder and type `pod install`
- wait for XCode indexing finishes

#### Android
- Install Android Studio with Android SDK and emulator / external device

## Config
 - Create `config` directory inside `app/common` directory.
 - Create `mobile.config.js` and fill your config
  (SAMPLE CONFIG: `tools/NOTES/default-dev-config.js-put-this-in-root/config.js` )
- production-ready config is encrypted and stored in company's GDrive, named `heyspace_config.zip`. Pass is stored in Vault.


## Dev build
- in `/app/HeySpaceMobile` run `yarn start` to start bundler

#### IOS
- in XCode choose emulator and push Play button

#### Android
- in `/app/HeySpaceMobile` run `yarn run android` to build app and upload to emulator / external device
