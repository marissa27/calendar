exports.seed = function(knex, Promise) {
  return knex('calendar').del()
    .then(function () {
      return Promise.all([
        knex('calendar').insert([
          {
            title: 'Alarm',
            description: 'to wake up',
            start: '9:00AM',
            end: '10:30AM',
          },
          {
            title: 'Lunch',
            description: 'time to eat',
            start: '12:00PM',
            end: '1:30PM',
          },
          {
            title: 'Code Challenge',
            description: 'Stay up on the Game',
            start: '2:00PM',
            end: '4:00PM',
          }
        ])
      ])

    });
};
