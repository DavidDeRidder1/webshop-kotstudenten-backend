# Examenopdracht Web Services
- Student: David De Ridder
- E-mailadres: <mailto:davidderidder2404@gmail.com>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten

- git clone https://github.com/DavidDeRidder1/webshop-kotstudenten-backend
- cd .\webshop-kotstudenten-backend\
- npm install
- .env aanmaken:
  - NODE_ENV=development
  - DATABASE_URL="mysql://username:mypassword@localhost:3306/mydb" (database url opstellen)
- npx prisma migrate deploy
- npx prisma db seed
- npm start

## Testen

- .env.test aanmaken
  - NODE_ENV=test
  - DATABASE_URL="mysql://username:mypassword@localhost:3306/mydb_test" (test database url opstellen)
- npm run test:prisma:migrate
- npm run test:with-seed (1ste keer falen er 3 testen, daarna slagen ze wel steeds allemaal)
