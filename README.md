[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Web Services

- Student: David De Ridder
- Studentennummer: 202293151
- E-mailadres: <mailto:david.deridder@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- ...

## Opstarten

- git clone https://github.com/Web-IV/2324-webservices-DavidDeRidder7.git
- cd .\2324-webservices-DavidDeRidder7\
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
