const sinon = require('sinon');
const request = require('supertest');
const app = require('../src/app');
const Sessions = require('../src/session');
const lib = require('../src/lib');
const { status } = require('../src/statusCodes');

beforeEach(() => {
  app.locals.sessions = new Sessions({ '1234': { userId: 1 } });
});

after(() => app.locals.db.destroy());

afterEach(() => {
  app.locals.sessions = new Sessions({});
});

describe('GET /clap/:id', () => {
  it('should give true when the user is not already clapped', (done) => {
    request(app)
      .post('/user/clap/3')
      .set('Cookie', 'sId=1234')
      .expect(/true/)
      .expect(status.OK, done);
  });

  it('should give false when the user is already clapped', (done) => {
    request(app)
      .post('/user/clap/4')
      .set('Cookie', 'sId=1234')
      .expect(/false/)
      .expect(status.OK, done);
  });

  it('should give null if user is not signed in', (done) => {
    request(app).post('/user/clap/4').expect(status.REDIRECT, done);
  });
});

describe('GET', () => {
  it('should serve the static html and css files', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/Dive deeper on topics that matter to you/, done);
  });

  it('should serve the static html and css files', (done) => {
    request(app)
      .get('/css/menubar.css')
      .set('Accept', '*/*')
      .expect('Content-type', /text\/css/)
      .expect(/body/, done);
  });
});

describe('GET /', () => {
  it('should serve sign in page if not signed in', (done) => {
    request(app)
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(/Dive deeper on topics that matter to you/, done);
  });

  it('should serve dashboard if signed in', (done) => {
    request(app)
      .get('/')
      .set('Cookie', 'sId=1234')
      .expect(/PostIt/, done);
  });
});

describe('GET /signIn', () => {
  it('should redirect to github authentication', (done) => {
    request(app).get('/signIn').expect(status.REDIRECT, done);
  });

  it('should redirect to home page if already signed in', (done) => {
    request(app)
      .get('/signIn')
      .set('Cookie', 'sId=1234')
      .expect(status.REDIRECT, done);
  });
});

describe('Ensure login', () => {
  it('should get css file if session is there', (done) => {
    request(app)
      .get('/user/css/editor.css')
      .set('Cookie', 'sId=1234')
      .expect('Content-type', /text\/css/)
      .expect(status.OK, done);
  });

  it('should give sign in if cookie are not there', (done) => {
    request(app)
      .get('/user/editor')
      .expect('Location', '/')
      .expect(status.REDIRECT, done);
  });
});

describe('GET /user/editor', () => {
  it('should get editor', (done) => {
    request(app)
      .get('/user/editor')
      .set('Cookie', 'sId=1234')
      .expect(/editorjs/)
      .expect(status.OK, done);
  });
});

describe('GET /blog/id', () => {
  it('should return the blog content if the blog is published', (done) => {
    request(app)
      .get('/blog/3')
      .set('Cookie', 'sId=1234')
      .expect(/profile/)
      .expect(/Read this blog/, done);
  });

  it('should return page not found for invalid blogId', (done) => {
    request(app)
      .get('/blog/104540')
      .set('Cookie', 'sId=1234')
      .expect(/Page Not Found/, done);
  });

  it('should return not found for string as blog Id ', (done) => {
    request(app)
      .get('/blog/string')
      .set('Cookie', 'sId=1234')
      .expect(/Page Not Found/, done);
  });

  it('should return the blog content if not signed in', (done) => {
    request(app)
      .get('/blog/3')
      .expect(/Read this blog/, done);
  });
});

describe('GET /user/signOut', () => {
  it('user should be redirected to the signIn page after signOut', (done) => {
    request(app)
      .get('/user/signOut')
      .set('Cookie', 'sId=1234')
      .expect(status.REDIRECT, done);
  });
});

describe('GET /comments/:blogId', () => {
  it('should give the comments on the given blog id', (done) => {
    request(app)
      .get('/comments/4')
      .set('Cookie', 'sId=1234')
      .expect(/superb/)
      .expect(status.OK, done);
  });

  it('should give status.NOTFOUND error page if blog id doesnot exist', (done) => {
    request(app)
      .get('/comments/10')
      .set('Cookie', 'sId=1234')
      .expect(status.NOTFOUND, done);
  });
});

describe('POST /autosave', () => {
  it('should return back id of the new drafted post if request id is -1', (done) => {
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
    request(app)
      .post('/user/autosave/-1')
      .set('Cookie', 'sId=1234')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .expect(/id/)
      .expect(/7/, done);
  });

  it('should return back id of the already drafted post on autosave', (done) => {
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
    request(app)
      .post('/user/autosave/2')
      .set('Cookie', 'sId=1234')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .expect(/id/)
      .expect(/2/, done);
  });

  it('should redirect to home page if not signed in', (done) => {
    const data = {};
    request(app)
      .post('/user/autosave/2')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .expect('Location', '/')
      .expect(status.REDIRECT, done);
  });
});

describe('/user/publishComment', () => {
  it('should publish the given comment', (done) => {
    const data = { comment: 'hiii', blogId: 1 };
    request(app)
      .post('/user/publishComment/')
      .set('Cookie', 'sId=1234')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .expect(status.OK, done);
  });
});

describe('GET /user/draft/:id', () => {
  it('should serve the editor with draft content', (done) => {
    request(app)
      .get('/user/draft/1')
      .set('Cookie', 'sId=1234')
      .expect(/Sample Post/, done);
  });

  it('should give error page if not signed in non-existing id', (done) => {
    request(app)
      .get('/user/draft/10')
      .set('Cookie', 'sId=1234')
      .expect(status.NOTFOUND, done);
  });

  it('should give redirect to sign in page if not signed in', (done) => {
    request(app).get('/user/draft/10').expect(status.REDIRECT, done);
  });
});

describe('GET /user/posts/drafts', () => {
  it('should give all the drafts of requested user', (done) => {
    request(app)
      .get('/user/posts/drafts')
      .set('Cookie', 'sId=1234')
      .expect(/Sample Post/)
      .expect(status.OK, done);
  });

  it('should redirect to sign in page if not signed in', (done) => {
    request(app).get('/user/posts/drafts').expect(status.REDIRECT, done);
  });
});

describe('GET /user/posts/published', () => {
  it('should give all the published of requested user', (done) => {
    request(app)
      .get('/user/posts/published')
      .set('Cookie', 'sId=1234')
      .expect(/Read this blog/)
      .expect(status.OK, done);
  });

  it('should redirect to sign in page if not signed in', (done) => {
    request(app).get('/user/posts/published').expect(status.REDIRECT, done);
  });
});

describe('GET /user/profile/id', () => {
  it('should give the details of user given id', (done) => {
    request(app)
      .get('/user/profile/1')
      .set('Cookie', 'sId=1234')
      .expect(/User1/)
      .expect(/Read this blog/, done);
  });

  it('should give error page if user does not exist', (done) => {
    request(app)
      .get('/user/profile/300')
      .set('Cookie', 'sId=1234')
      .expect(status.NOTFOUND, done);
  });
});

describe('GET /callback', () => {
  it('should redirect to dashboard after authentication', (done) => {
    const stubbed = sinon
      .stub()
      .onCall(0)
      .resolves('token=12345')
      .onCall(1)
      .resolves(
        JSON.stringify({ login: 'user', avatarUrl: 'https://img.com' })
      );
    sinon.replace(lib, 'makeRequest', stubbed);
    request(app)
      .get('/callback')
      .expect('Location', '/')
      .expect(status.REDIRECT, done);
  });
});

describe('GET /user/search', () => {
  it('should give all the published posts of requested author', (done) => {
    request(app)
      .get('/user/search?searchText=@User2')
      .set('Cookie', 'sId=1234')
      .expect(/testing search/)
      .expect(/testing the search/)
      .expect(status.OK, done);
  });

  it('should give all the published posts to related title', (done) => {
    request(app)
      .get('/user/search?searchText=testing')
      .set('Cookie', 'sId=1234')
      .expect(/testing search/)
      .expect(/testing the search/)
      .expect(status.OK, done);
  });

  it('should give all the published posts to related tags', (done) => {
    request(app)
      .get('/user/search?searchText=#testing')
      .set('Cookie', 'sId=1234')
      .expect(/testing search/)
      .expect(status.OK, done);
  });
});

describe('GET /delete/:id', () => {
  it('should give the details of user given id', (done) => {
    request(app)
      .get('/user/delete/1')
      .set('Cookie', 'sId=1234')
      .expect(status.REDIRECT, done);
  });
});

describe('GET /follow/:id', () => {
  it('should give true when user is not already following', (done) => {
    request(app)
      .get('/user/follow/3')
      .set('Cookie', 'sId=1234')
      .expect(/true/)
      .expect(status.OK, done);
  });

  it('should give false when the user is already following', (done) => {
    request(app)
      .get('/user/follow/3')
      .set('Cookie', 'sId=1234')
      .expect(/false/)
      .expect(status.OK, done);
  });

  it('should give bad request when the userId and followerId are same', (done) => {
    request(app)
      .get('/user/follow/1')
      .set('Cookie', 'sId=1234')
      .expect(status.BADREQ, done);
  });
});

describe('GET /user/profile/:id/followers', () => {
  it('should give the follower details of given user id', (done) => {
    request(app)
      .get('/user/profile/2/followers')
      .set('Cookie', 'sId=1234')
      .expect(/1/)
      .expect(/followers/)
      .expect(/User1/, done);
  });

  it('should give error page if user does not exist', (done) => {
    request(app)
      .get('/user/profile/300/followers')
      .set('Cookie', 'sId=1234')
      .expect(status.NOTFOUND, done);
  });
});

describe('GET /user/profile/:id/following', () => {
  it('should give the following details of given user id', (done) => {
    request(app)
      .get('/user/profile/1/following')
      .set('Cookie', 'sId=1234')
      .expect(/1/)
      .expect(/following/)
      .expect(/User1/, done);
  });

  it('should give error page if user does not exist', (done) => {
    request(app)
      .get('/user/profile/300/following')
      .set('Cookie', 'sId=1234')
      .expect(status.NOTFOUND, done);
  });
});

describe('GET /user/editProfile', () => {
  it('should give edit profile page if signed in', (done) => {
    request(app)
      .get('/user/editProfile')
      .set('Cookie', 'sId=1234')
      .expect(/save/, done);
  });
});

describe('GET /clappedPosts', () => {
  it('should give posts on which user has clapped', (done) => {
    request(app)
      .get('/user/clappedPosts/1')
      .set('Cookie', 'sId=1234')
      .expect(/testing the search/, done);
  });
});

describe('GET /profile/:id/comments', () => {
  it('should give posts on which user has commented', (done) => {
    request(app)
      .get('/user/profile/1/comments')
      .set('Cookie', 'sId=1234')
      .expect(/Comment on this/, done);
  });
});

describe('POST /user/updateProfile', () => {
  it('should update the displayName of the user', (done) => {
    request(app)
      .post('/user/updateProfile')
      .set('Cookie', 'sId=1234')
      .send(JSON.stringify({ displayName: 'sriRam' }))
      .expect(status.REDIRECT)
      .expect('Location', '/user/profile/1', done);
  });
});
