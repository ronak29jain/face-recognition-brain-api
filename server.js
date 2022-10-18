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
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

app.get('/', (req, res) => {res.send('app is working')})
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db, bcrypt) })
app.put('/image', (req, res) => { image.handleImage(req, res, db, bcrypt) })

app.listen(process.env.PORT,() => {
  console.log(`app is running at port ${process.env.PORT}`)
})