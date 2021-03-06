const db = require('../../../models/v1');

function search(req, res) {
  const { name } = req.query;

  const nameRE = new RegExp(name, 'i');

  db.Album.find({
    name: nameRE,
  })
    .then(dbAlbum => res.json(dbAlbum))
    .catch(err => res.status(422).json(err));
}

module.exports = search;
