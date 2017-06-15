process.env.NODE_ENV = 'test';

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp)

describe('Everything', () => {

  beforeEach((done) => {
   database.migrate.latest()
   .then(() => {
     return database.seed.run()
   })
   .then(() => {
     done()
   })
 })

 afterEach((done) => {
   database.migrate.rollback()
   .then(() => {
     done()
   })
 })

  describe('Client Routes', () => {

    it('GET should return the homepage', (done) => {
      chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.html
        done()
      })
    })

    it('GET should return a 404 for a non existent route', (done) => {
      chai.request(server)
      .get('/sad')
      .end((err, response) => {
        response.should.have.status(404)
        done()
      })
    })
  })

  describe('API Routes', () => {
    it('GET should return all of the events', (done) => {
      chai.request(server)
      .get('/api/v1/events')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.length.should.equal(3)
        response.body[0].should.have.property('title')
        response.body[0].title.should.equal('Alarm')
        done()
      });
    });

    it('GET should return 404 for non existent route', (done) => {
      chai.request(server)
      .get('/api/v1/itemsad')
      .end((error, response) => {
        response.should.have.status(404)
        done()
      });
    })

    it('POST should create a new item', (done) => {
      chai.request(server)
      .post('/api/v1/events')
      .send(
        {
          title: 'test',
          description: 'testing route',
          start: '8',
          end: '10',
        },
      )
      .end((error, response) => {
        response.should.have.status(201)
        response.body.should.be.a('object')
        response.body.should.have.property('title')
        response.body.name.should.equal('test')
        chai.request(server)
        .get('/api/v1/events')
        .end((error, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body.length.should.equal(4)
          response.body[3].should.have.property('title')
          response.body[3].title.should.equal('test')
          done()
        })
      })
    })


    it('POST should not create an item with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/events')
      .send({
        description: 'testing',
        start: 4,
        end: 5
      })
      .end((err, response) => {
        response.should.have.status(422)
        response.body.error.should.equal('You are missing the title')
      })

      chai.request(server)
      .post('/api/v1/events')
      .send({
        title: 'test',
        start: 4,
        end: 5
      })
      .end((err, response) => {
        response.should.have.status(422)
        response.body.error.should.equal('You are missing the description')
      })

      chai.request(server)
      .post('/api/v1/events')
      .send({
        title: 'testing',
        description: 'to test stuff',
        end: 5
      })
      .end((err, response) => {
        response.should.have.status(422)
        response.body.error.should.equal('Please include a start time')
        done()
      })

      chai.request(server)
      .post('/api/v1/events')
      .send({
        title: 'testing',
        description: 'to test stuff',
        start: 5
      })
      .end((err, response) => {
        response.should.have.status(422)
        response.body.error.should.equal('Please include an end time')
        done()
      })
    })


  })
})
