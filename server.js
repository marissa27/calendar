const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Calendar';

app.use(express.static('public'));

// API CALLS

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
});

app.get('/api/v1/events', (request, response) => {
  database('calendar').select()
  .then(item => response.status(200).json(item))
  .catch(error => response.status(404).send({ error }))
});

app.get('/api/v1/events/:id', (request, response) => {
  database('calendar').where('id', request.params.id).select()
    .then(item => response.status(200).json(item))
    .catch((error) => {
      response.status(404).send('This event does not exist', error);
    });
});

app.post('/api/v1/events', (request, response) => {
  const item = request.body;

  const { title, description, start, end } = request.body;

  if (!title) {
    response.status(422).send({
      error: 'You are missing the title'
    })
  } else if (!description) {
    response.status(422).send({
      error: 'You are missing the description'
    })
  } else if (!start) {
    response.status(422).send({
      error: 'Please include a start time'
    })
  } else if (!end) {
    response.status(422).send({
      error: 'Please include an end time'
    })
  } else {
    database('calendar').insert(item)
    .then(events => {
      response.status(201).json({ title: title, description: description, start: start, end: end })
    })
    .catch(error => {
      response.status(500).send({ error });
    })
  }
});


// end

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  });
}

module.exports = app;
