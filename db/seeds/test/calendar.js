exports.seed = function(knex, Promise) {
  return knex('calendar').del()
    .then(function () {
      return Promise.all([
        knex('calendar').insert([
          {
            title: 'Alarm',
            description: 'Daily wake-up',
            start: '9',
            end: '9:10',
          },
          {
            title: 'Lunch',
            description: 'To eat',
            start: '12',
            end: '1',
          },
          {
            title: 'TV',
            description: 'Watch show',
            start: '5',
            end: '6',
          },
        ])
      ])

    });
};
