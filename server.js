require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const kenx = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = kenx({
  client: 'pg',
  connection: {
    host : process.env.PG_HOST,
    port : process.env.PG_PORT,
    user : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    database : process.env.PG_DATABASE
  }
});

const app = express();

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

// app.get('/', (req, res) => {
//   db('users').select('*')
//     .then(users => {res.status(200).json(users)})
//     .catch (err => res.status(400).json('error getting users'))
// })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db, bcrypt) })
app.put('/image', (req, res) => { image.handleImage(req, res, db, bcrypt) })

app.listen(process.env.PORT,() => {
  console.log(`app is running at port ${process.env.PORT}`)
})