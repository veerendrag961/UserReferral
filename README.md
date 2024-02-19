
# UserReferral

In this application, users can sign up and sign in. Additionally, users can add referrals to other users, who will then receive an email notification.

This application is using:
* Ruby version 3.0.1
* Rails version 7.1.3
* Node version 14.21
* mysql2


### Install dependencies
To install dependencies for the application, run the following command in your terminal:

```
bundle install
yarn install
```


### Configure database

Before running the application, set up the database by following these steps:

Create a database.yml file by copying database.example.yml.
Add all the necessary configurations to database.yml.


### Create database

```
rails db:create
```

### Run migrations

```
rails db:migrate
```

## Run the application
```
./bin/dev
```
