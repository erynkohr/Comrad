const db = require('../models');

module.exports = {
  search: async (req, res) => {
    const { searchTerm } = req.body;
    const q = new RegExp(searchTerm, 'i');

    if(searchTerm === '') {
      return res.json([]);
    }

    const albumResults = await db.Album.find({ name: q });
    const artistResults = await db.Artist.find({ name: q })
    const trackResults = await db.Track.find({ name: q }); 

    const data = [
      ...albumResults, 
      ...artistResults, 
      ...trackResults
    ].sort((a, b) => {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });

    return res.json(data);
  },

  searchUsers: async (req, res) => {
    const { searchTerm } = req.body;
    const q = new RegExp(searchTerm, 'i');

    const userResults = await db.User.find({ $or: [{ email: q }, { first_name: q }, { last_name: q }] });

    const data = [
      ...userResults
    ].sort((a, b) => {
      if(a.last_name < b.last_name) return -1;
      if(a.last_name > b.last_name) return 1;
      return 0;
    });

    return res.json(data);
  }
}