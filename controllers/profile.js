const handleProfile = (req, res, db) => {
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
}

module.exports = {
  handleProfile: handleProfile
}