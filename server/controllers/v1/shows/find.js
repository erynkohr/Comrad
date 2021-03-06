const db = require('../../../models/v1');

const {
  utils: { findShowQueryByDateRange, showList },
} = require('./utils');

function find(req, res) {
  console.log(req);
  let { startDate, endDate } = req.query;
  console.log(startDate);
  startDate = startDate ? JSON.parse(startDate) : null;
  endDate = endDate ? JSON.parse(endDate) : null;

  //This date filter allows the same endpoint to be used to find all shows or return a subset if both startDate and endDate are provided.
  const showDateFilter =
    startDate && endDate ? findShowQueryByDateRange(startDate, endDate) : {};

  db.Show.find({})
    .and(showDateFilter)
    .populate('show_details.host', [
      'profile.first_name',
      'profile.last_name',
      'station.on_air_name',
    ])
    .then(dbShow => {
      res.json(showList(dbShow));
    })
    .catch(err => res.status(422).json(err));
}

module.exports = find;
