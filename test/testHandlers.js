const request = require('supertest');
const app = require('../src/app');

describe('GET', () => {
  it('should serve the static html and css files', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/POST\-IT/, done);
  });
});

describe('GET /', () => {
  it('should serve sign in page if not signed in', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/POST\-IT/, done);
  });
  it('should serve dashboard if signed in', (done) => {
    app.locals.sessions = { '1234': 'Phaneendra' };
    request(app)
      .get('/')
      .set('Cookie', 'sId=1234')
      .expect(/Phaneendra/, done);
  });
});
