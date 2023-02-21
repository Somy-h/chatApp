# CREATE DATABASE
    use ./chatApp/bchat-server/db_schema/createDB.sql

# CREATE SERVER CONNECTION
create .env file in ./chatApp/bchat-server/  with:
PORT      = "4000"
FRONT_URL = "http://localhost:3000/"
BACK_URL  = "http://localhost:4000/"
DB_HOST   = "localhost"
DB_USER   = "root"
DB_PASSWORD = "12345678"
DB_NAME   = "communication_db"
DB_PORT   = "3306"
JWT_KEY   = "communicationapptokenkey"

# STARTING UP APPLICATION
install all depencencies inside both ./chatApp/bchat-front/  and ./chatApp/bchat-server/
to start server use "nodemon" in terminal inside ./chatApp/bchat-server/
to start front-end use "npm start" in terminal inside ./chatApp/bchat-front/

