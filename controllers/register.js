const handleRegister = (req, res, db, bcrypt) => {
  const {email, name, password} = req.body

  if (!email || !password) {
    return res.status(404).json('fill all the details')
  }

  const hash = bcrypt.hashSync(password);
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
}

module.exports = {
  handleRegister: handleRegister
}