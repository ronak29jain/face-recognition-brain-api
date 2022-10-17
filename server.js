const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const kenx = require('knex');

const db = kenx({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'ronak',
    password : 'asdf',
    database : 'smart-brain'
  }
});

// console.log("database testing: ",db.select("*").from('users'))

// console.log("db testing", db('users').select('*'))
// db('users').select('*').then(data => console.log(data))

// db.select('*').from('users').then(data => {
//   console.log(data);
// })

const app = express();


// const database = {
//   users: [
//     {
//       id: 126,
//       email: 'ronak29jain@gmail.com',
//       name: 'Ronak Jain',
//       password: 'secretDungen',
//       entries: 4,
//       joined: new Date()
//     },
//     {
//       id: 127,
//       email: 'harshkumarjain@gmail.com',
//       name: 'Harsh Jain',
//       password: 'secretHotel',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: 128,
//       email: 'sadhana69jain@gmail.com',
//       name: 'Sadhana Jain',
//       password: 'secretHouse',
//       entries: 0,
//       joined: new Date()
//     },
//   ]
// }

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

app.get('/', (req, res) => {
  db('users')
    .select('*')
    .then(users => {res.status(200).json(users)})
    .catch (err => res.status(400).json('error getting users'))
})

// app.get('/signin', (req, res) => {
//   res.send('hello')
// })

app.post('/signin', (req, res) => {
  const {email, password} = req.body
  // let found = false;
  // let currentuser = null
  // // console.log('email:', email)
  // // console.log('password:', password)
  // database.users.map(user => {
  //   if (email === user.email && password === user.password) {
  //     found = true;
  //     currentuser=user;
  //     // return res.status(200).json(`Success, with Email: ${email} and Password: ${password}`)
  //   }
  // })
  // res.status(200).json(currentuser)
  // if (!found) {
  //   // res.status(400).send(`Fail to login, User email or password doesn't match`)
  // }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(Credential => {
      if(Credential.length){
        if(bcrypt.compareSync(password, Credential[0].hash)){
          db.select('*').from('users')
            .where({email})
            .then(user => {
              res.status(200).json(user[0])
            })
            .catch (err => res.status(400).json('unable to get user'))
        } else{
          res.status(404).json('wrong password')
        }
      } else {
        res.status(404).json('No Such user is found')
      }
    })

})

app.post('/register', (req, res) => {
  const {email, name, password} = req.body
  // const newUser = {
  //   "id": 120,
  //   "email": email,
  //   "name": name,
  //   "password": password,
  //   "entries": 0,
  //   "joined": new Date()
  // }
  // database.users.push(newUser)

  const hash = bcrypt.hashSync(password);

  // bcrypt.compareSync("bacon", hash); // true
  // bcrypt.compareSync("veggies", hash); // false

  db.transaction(trx => {
    trx
      .insert({
        hash, email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            "email": loginEmail[0].email,
            "name": name,
            "joined": new Date()
          })
          .then(user => {
            res.status(200).json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Unable to Register'))
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  db('users')
    .where({id})
    .select('*')
    .then(user => {
      if (user.length){
        res.status(200).json(user[0])
      } else {
        res.status(400).json('user not found')
      }
    })
    .catch (err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const {id} = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(response => {
      // console.log('entries from server: ', response[0].entries)
      res.status(200).json(response[0].entries)
    })
    .catch(err => res.status(400).json('error updating the entires:') )
})


app.listen(3000,() => {
  console.log('app is running at port 3000')
})