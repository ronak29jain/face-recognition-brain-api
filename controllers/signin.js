const handleSignin = (req, res, db, bcrypt) => {
  const {email, password} = req.body
  
  if (!email || !password) {
    return res.status(404).json('fill all the details')
  }
  
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
    .catch(err => res.status(400).json('unable to signin'))
}

module.exports = {
  handleSignin: handleSignin
}