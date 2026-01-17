![example workflow](https://github.com/timecamp-org/timecamp-v3-frontend/actions/workflows/deploy.yml/badge.svg)


[Contribution guide](docs/CONTRIBUTION.md)
===
[Release guide](docs/RELEASING.md)
===

[HeySpace Ecosystem](https://app.milanote.com/1J6buD1CpH93db/heyspace-app)
===

# Application setup (Linux/OSX recommended)

## [Mobile setup](docs/MOBILE.md)

### Install prerequisites
- Node (NVM recommended): https://github.com/nvm-sh/nvm#installing-and-updating
- Yarn: 
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add 
$ sudo sh -c "echo deb https://dl.yarnpkg.com/debian stable main \
> /etc/apt/sources.list.d/yarn.list"
$ sudo apt-get update
$ sudo apt-get install yarn
```

### Checkout && pull latest dev branch

```
git checkout dev

git pull origin dev
```

### Install npm packages

```
yarn   # post install script will install packages recursively wherever package.json is
```

### Config
 - Create `config` directory inside `app/common` directory.
 - Create `web.config.js` and create your config 
 (SAMPLE CONFIG:  [default-dev-config.js-put-this-in-root](tools/NOTES/default-dev-config.js-put-this-in-root/config.js) )
 This sample web config is sufficient for app to run. You don't have to include api keys or nothing else.
 
 
 ### Start dev server
 
 ``` 
 yarn start

 enter: http://localhost:3000

 ```
