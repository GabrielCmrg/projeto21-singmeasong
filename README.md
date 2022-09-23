# <p align = "center"> Project 21: Sing me a song </p>

<p align="center">
   <img src="./microphone.svg" alt="microphone" height="200"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-GabrielCmrg,_Driven_education-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/GabrielCmrg/projeto21-singmeasong?color=4dae71&style=flat-square" />
</p>

## :clipboard: Description

This app was developed by [Driven Education](https://github.com/driven-projects/sing-me-a-song), it is a social media where you can share your favourite songs. I will add tests and readmes to this project, and you are wellcome to use it to learn.

---

## :computer: Technologies and Concepts

- REST APIs
- JWTs
- Node.js
- TypeScript
- Postgres with prisma
- Tests with jest and cypress
- Env variables

---

## 🏁 Rodando a aplicação

This project was created with [Create React App](https://github.com/facebook/create-react-app), so ensure that you have tha latest stable version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) running locally.

First, clone this repo in your machine:

```
git clone https://github.com/GabrielCmrg/projeto21-singmeasong
```

After, go to the `front-end` folder and run the following command to install the dependencies.

```
npm install
```

After this, you can start your front-end application with

```
npm start
```

:stop_sign: The front-end application will not work correctly if you dont start the back-end server. To do this, you will need to go to the `back-end` folder and run the following command from a different terminal tab

```
npm install
```

And after you installed the dependencies, you will need to create a `.env` file with the variables present on the `.env.example` and create the database with the command

```
npx prisma migrate dev
```

Then, you can run the server on development mode with

```
npm run dev
```
