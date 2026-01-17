
![app preview](https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c7ef59032814328721f05d2f6cce425059ce43c19f3a3fc2772610bec2aa92ed)

[Contribution guide](docs/CONTRIBUTION.md)
===
[Release guide](docs/RELEASING.md)
===
[Monitoring guide](docs/MONITORING.md)
===
[Incidents guide](docs/INCIDENTS.md)
===
[Tools guide](docs/TOOLS.md)
===

[HeySpace Ecosystem](https://app.milanote.com/1J6buD1CpH93db/heyspace-app)
===

# Application setup (Linux/OSX recommended)

### Install prerequisites

#### Postgresql:  
(Ubuntu) https://tecadmin.net/install-postgresql-server-on-ubuntu/ 
(OSX) https://postgresapp.com/downloads.html   

Change default postgres user password in psql:

```
ALTER USER postgres WITH ENCRYPTED PASSWORD 'postgres'
```


#### Node (NVM recommended): https://github.com/nvm-sh/nvm#installing-and-updating

#### Yarn: 

Ubuntu
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add 
$ sudo sh -c "echo deb https://dl.yarnpkg.com/debian stable main \
> /etc/apt/sources.list.d/yarn.list"
$ sudo apt-get update
$ sudo apt-get install yarn
```

OSX https://classic.yarnpkg.com/en/docs/install/#mac-stable

#### (Mac only) coreutils (realpath is needed for db creation script)
```
brew install coreutils
```

### Checkout && pull latest dev branch

```
git checkout dev

git pull origin dev
```

### Install npm packages

```
yarn
```

### Env config
 Create .env file in project root and add following lines:
 
 ```
 DB_ALLOW_DROP=true
 (optional) PASSWORD="postgres_user"
 (optional) USER="postgres_password"
 ```

### Backend config
If you want to overwrite app config included in `src/config/*`, place new file in `config.local` directory, for example: `config.local/index.ts` (you can find example custom config  [HERE](docs/sample_app.config.ts))


 
 ### Initialize database and run migrations
 
 ``` 
 yarn recreate_db
 yarn migrate
 ```

 ### Run project

 #### Watch mode

 ```
 yarn start
 ```

 OR

 #### Type and Run

 ```
 yarn tsc && node dist/run.js
 ```

 ### View our current server stack: https://app.milanote.com/1J6buD1CpH93db/heyspace-app


### Templates config
Loading templates from termnial [HERE](docs/load-templates.md)
