const moment = require('moment');
const { RRule } = require('rrule');
const _ = require('lodash');

function createNewShow(req, res) {
  let { repeatType } = req.body;

  if (repeatType) {
    repeatType = JSON.parse(repeatType);
  } else {
    repeatType = {};
  }

  return {
    status: 'Active',
    show_details: {
      title: req.body.title,
      summary: req.body.summary,
      description: req.body.description,
      producer: req.body.producer,
      host: req.body.host,
      guests: req.body.guests,
      playlist: req.body.playlist,
      custom: req.body.custom,
    },

    show_start_time_utc: req.body.show_start_time_utc,
    show_end_time_utc: req.body.show_end_time_utc,

    is_recurring: req.body.repeat,
    repeat_rule: {
      frequency: repeatType.freq,
      repeat_start_date: moment(req.body.repeat_start_date).startOf('day'),
      repeat_end_date: moment(req.body.repeat_end_date).endOf('day'),
      count: repeatType.count,
      interval: repeatType.interval,
      byweekday: repeatType.byweekday,
      bymonth: repeatType.bymonth,
      bysetpos: repeatType.bysetpos,
      bymonthday: repeatType.bymonthday,
    },
  };
}

function showList(shows) {
  const allRepeatShows = reduceShowsByRepeatProperty(shows, true);
  const allRepeatShowsExpanded = allRepeatShows.map(show => {
    const allShowDates = returnDatesArrayByRepeatRule(show);
    const allRepeatedShowsExpandedByDates = returnShowsArrayWithNewDates(
      allShowDates,
      show,
    );

    return allRepeatedShowsExpandedByDates;
  });

  let allNonRepeatShows = reduceShowsByRepeatProperty(shows, false);
  allNonRepeatShows = allNonRepeatShows.map(show => {
    const date = show.repeat_rule.repeat_start_date;
    show.show_start_time_utc = momentCombineDayAndTime(
      date,
      show.show_start_time_utc,
    );
    show.show_end_time_utc = momentCombineDayAndTime(
      date,
      show.show_end_time_utc,
    );

    return show;
  });

  //Need to check for master_show_uid and then replace those shows within allShows
  const mergedShows = _.concat(allRepeatShowsExpanded, allNonRepeatShows);

  return _.flatten(mergedShows);
}

function reduceShowsByRepeatProperty(shows, recurringCheckValue) {
  const reducer = (accShows, currentShow) => {
    if (currentShow.is_recurring === recurringCheckValue) {
      return [...accShows, currentShow];
    }
    return accShows;
  };

  const reducedShowList = shows.reduce(reducer, []);

  return reducedShowList;
}

function returnDatesArrayByRepeatRule(show) {
  const { is_recurring } = show;

  if (is_recurring) {
    const rule = new RRule(createRRule(show));
    try {
      return rule.all();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

function momentCombineDayAndTime(desiredDate, desiredTime) {
  const newDate = moment(desiredDate).format('YYYYMMDD');
  const newTime = moment(desiredTime).format('HH:mm:ss');
  const newDateAndTimeFormat = newDate + ' ' + newTime;
  const returnedValue = moment(newDateAndTimeFormat, 'YYYYMMDD HH:mm:ss')
    .utc()
    .format();

  return returnedValue;
}

function returnShowsArrayWithNewDates(dateArray, show) {
  const returnedShows = dateArray.map((date, i) => {
    let newShow = { ...show.toObject() };
    const show_start_time_utc = momentCombineDayAndTime(
      date,
      show.show_start_time_utc,
    );
    const show_end_time_utc = momentCombineDayAndTime(
      date,
      show.show_end_time_utc,
    );

    newShow.master_show_uid = newShow._id;
    newShow._id = newShow._id + '-' + i;
    newShow.show_start_time_utc = show_start_time_utc;
    newShow.show_end_time_utc = show_end_time_utc;

    return newShow;
  });
  return returnedShows;
}

function createRRule(show) {
  const {
    frequency,
    repeat_start_date,
    repeat_end_date,
    interval,
    count,
    byweekday,
    bymonth,
    bysetpos,
    bymonthday,
  } = show.repeat_rule;

  let newRRule = {};

  if (frequency) {
    newRRule.freq = frequency;
  }

  if (repeat_start_date) {
    newRRule.dtstart = repeat_start_date;
  }

  if (repeat_end_date) {
    newRRule.until = repeat_end_date;
  }

  if (count) {
    newRRule.count = count;
  }

  if (interval) {
    newRRule.interval = interval;
  }

  if (byweekday) {
    newRRule.byweekday = byweekday.map(day => RRule[day]);
  }

  if (bymonth) {
    newRRule.bymonth = [bymonth];
  }

  if (bysetpos) {
    newRRule.bysetpos = [bysetpos];
  }

  if (bymonthday) {
    newRRule.bymonthday = [bymonthday];
  }

  return newRRule;
}

function findShowQueryByDateRange(start, end) {
  return [
    {
      'repeat_rule.repeat_start_date': {
        $lte: end,
      },
    },
    {
      'repeat_rule.repeat_end_date': {
        $gte: start,
      },
    },
  ];
}

module.exports = {
  createNewShow,
  showList,
  findShowQueryByDateRange,
};
