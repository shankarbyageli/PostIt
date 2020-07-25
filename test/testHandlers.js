const request = require('supertest');
const app = require('../src/app');

describe('GET', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });

  it('should serve the static html and css files', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/Dive deeper on topics that matter to you/, done);
  });

  it('should serve the static html and css files', (done) => {
    request(app)
      .get('/css/signIn.css')
      .set('Accept', '*/*')
      .expect('Content-type', /text\/css/)
      .expect(/body/, done);
  });
});

describe('GET /', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });
  it('should serve sign in page if not signed in', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/Dive deeper on topics that matter to you/, done);
  });

  it('should serve dashboard if signed in', (done) => {
    app.locals.sessions = { '1234': 1 };
    request(app)
      .get('/')
      .set('Cookie', 'sId=1234')
      .expect(/PostIt/, done);
  });
});

describe('GET /signIn', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });
  it('should redirect to github authentication', (done) => {
    request(app).get('/signIn').expect(302, done);
  });
});

describe('POST /publish', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });
  const data = {
    title: 'my title',
    content: {
      time: 1552744582955,
      blocks: [
        {
          type: 'text',
          data: {
            text:
              'https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg',
          },
        },
      ],
      version: '2.11.10',
    },
  };

  it('Should publish the post', (done) => {
    app.locals.sessions = { '1234': '1' };
    request(app)
      .post('/user/publish')
      .set('Cookie', 'sId=1234')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .expect('Published')
      .expect(200, done);
  });
});

describe('Ensure login', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });

  it('should get css file if session is there', (done) => {
    app.locals.sessions = { '1234': '1' };
    request(app)
      .get('/user/css/editor.css')
      .set('Cookie', 'sId=1234')
      .expect('Content-type', /text\/css/)
      .expect(200, done);
  });

  it('should give sign in if cookie are not there', (done) => {
    request(app)
      .get('/user/editor')
      .expect(/Dive deeper on topics that matter to you/)
      .expect(200, done);
  });
});

describe('GET /user/editor', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });

  it('should get editor', (done) => {
    app.locals.sessions = { '1234': '1' };
    request(app)
      .get('/user/editor')
      .set('Cookie', 'sId=1234')
      .expect(/id="publish">Publish/)
      .expect(200, done);
  });
});

describe('GET /blog/id', () => {
  afterEach(() => {
    app.locals.sessions = {};
  });

  it('should return the blog content if the blog is published', (done) => {
    request(app)
      .get('/blog/1')
      .expect(/signIn/, done);
  });

  it('should return the blog content if the blog is published', (done) => {
    app.locals.sessions = { '1234': 1 };
    request(app)
      .get('/blog/1')
      .set('Cookie', 'sId=1234')
      .expect(/user-profile/, done);
  });
});
