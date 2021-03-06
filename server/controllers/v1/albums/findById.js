const db = require('../../../models/v1');

async function findById(req, res) {
  const dbAlbum = await db.Album.findById(req.params.id).populate('artist');

  if (!dbAlbum) {
    res.status(422).json('Album does not exist');
  }

  const dbTracks = await db.Track.find({ album: dbAlbum._id });
  const data = {
    ...dbAlbum._doc,
    tracks: dbTracks,
  };

  res.status(200).json(data);
}

module.exports = findById;
