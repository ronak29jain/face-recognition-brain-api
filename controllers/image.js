const handleImage = (req, res, db) => {
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
}

module.exports = {
  handleImage: handleImage
}