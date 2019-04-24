const db = require('../../../models/v1');

function create(req, res) {
  db.Track.create(req.body)
    .then(dbTrack => res.json(dbTrack))
    .catch(err => res.status(422).json(err));
}

module.exports = create;