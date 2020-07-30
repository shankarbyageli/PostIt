const Database = require('../src/database');
const assert = require('assert');

describe('addPost', () => {
  it('should give error if database failure in run', (done) => {
    const db = {
      get: (query, callback) => callback(null, null),
      run: (query, callback) => callback('error'),
      serialize: (callback) => callback(run),
    };
    const database = new Database(db);
    database
      .addPost({ id: 1, title: 'title', content: { time: '1' } }, 2)
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should give error if database failure in get', (done) => {
    const db = {
      get: (query, callback) => callback('error'),
      run: (query, callback) => callback(null),
      serialize: (callback) => callback(run),
    };
    const database = new Database(db);
    database
      .addPost({ id: 1, title: 'title', content: { time: '1' } }, 2)
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should add the post to database', (done) => {
    const db = {
      get: (query, callback) => callback(null, { id: 1 }),
      run: (query, callback) => callback(null),
      serialize: (callback) => callback(),
    };
    const database = new Database(db);
    database
      .addPost({ title: 'title', content: { time: '1' } }, 2)
      .then((actual) => {
        assert.equal(actual, 1);
        done();
      }, null);
  });
});

describe('updatePost', () => {
  it('should give error if database failure', (done) => {
    const db = { run: (query, callback) => callback('error') };
    const database = new Database(db);
    database
      .updatePost(1, { title: 'title', content: { time: '1' } })
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should update the content of given post id', (done) => {
    const db = { run: (query, callback) => callback(null, true) };
    const database = new Database(db);
    database
      .updatePost(1, { title: 'title', content: { time: '1' } })
      .then((actual) => {
        assert.ok(actual);
        done();
      }, null);
  });
});

describe('publishPost', () => {
  it('should give error if database failure', (done) => {
    const db = { run: (query, callback) => callback('error') };
    const database = new Database(db);
    database.publishPost(1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should publish the drafted post given the id', (done) => {
    const db = { run: (query, callback) => callback(null, true) };
    const database = new Database(db);
    database.publishPost(1).then((actual) => {
      assert.ok(actual);
      done();
    }, null);
  });
});

describe('getPost', () => {
  it('should give error if database failure', (done) => {
    const db = { get: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getPost(2, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the post from database', (done) => {
    const db = { get: (query, callback) => callback(null, true) };
    const database = new Database(db);
    database.getPost(2, 1).then((actual) => {
      assert.ok(actual);
      done();
    }, null);
  });
});

describe('getAllPosts', () => {
  it('should give error if database failure', (done) => {
    const db = { all: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getAllPosts(1, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get all the posts of given type from database', (done) => {
    const db = { all: (query, callback) => callback(null, [{}, {}]) };
    const database = new Database(db);
    database.getAllPosts(1, 1).then((actual) => {
      assert.deepStrictEqual(actual, [{}, {}]);
      done();
    }, null);
  });
});

describe('getUserById', () => {
  it('should give error if database failure', (done) => {
    const db = { get: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getUserById(2).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the user details of given id', (done) => {
    const db = {
      get: (query, callback) => callback(null, { username: 'ramu' }),
    };
    const database = new Database(db);
    database.getUserById(2).then((actual) => {
      assert.deepStrictEqual(actual, { username: 'ramu' });
      done();
    }, null);
  });
});

describe('addUser', () => {
  it('should give error if database failure', (done) => {
    const db = { run: (query, callback) => callback('error') };
    const database = new Database(db);
    database
      .addUser({ login: 'kaka', avatar_url: 'https://img.com' })
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should add the given user details to users table and return true', (done) => {
    const db = { run: (query, callback) => callback(null, true) };
    const database = new Database(db);
    database
      .addUser({ login: 'kaka', avatar_url: 'https://img.com' })
      .then((actual) => {
        assert.ok(actual);
        done();
      }, null);
  });
});

describe('getUser', () => {
  it('should give error if database failure', (done) => {
    const db = { get: (query, params, callback) => callback('error') };
    const database = new Database(db);
    database.getUser('mama').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get user details of given id', (done) => {
    const db = {
      get: (query, params, callback) => callback(null, { user_id: 7 }),
    };
    const database = new Database(db);
    database.getUser('mama').then((actual) => {
      assert.deepStrictEqual(actual, { user_id: 7 });
      done();
    }, null);
  });

  it('should return false if user id doesn\'t exist', (done) => {
    const db = { get: (query, params, callback) => callback(null, null) };
    const database = new Database(db);
    database.getUser('mama').then((actual) => {
      assert.equal(actual, false);
      done();
    }, null);
  });
});

describe('getLatestPosts', () => {
  it('should give error if database failure', (done) => {
    const db = { all: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getLatestPosts(5).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the latest posts', (done) => {
    const db = {
      all: (query, callback) => callback(null, [{ username: 'ramu', id: 7 }]),
    };
    const database = new Database(db);
    database.getLatestPosts(5).then((actual) => {
      assert.deepStrictEqual(actual, [{ username: 'ramu', id: 7 }]);
      done();
    }, null);
  });
});

describe('getComments', () => {
  it('should get the post from database', (done) => {
    const db = { all: (query, callback) => callback(null, true) };
    const database = new Database(db);
    database.getComments(1).then((actual) => {
      assert.ok(actual);
      done();
    }, null);
  });

  it('should give error for database failure ', (done) => {
    const db = { all: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getComments('ab').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });
});

describe('addComment', () => {
  it('should give error if database failure', (done) => {
    const db = { run: (query, callback) => callback('error') };
    const database = new Database(db);
    database
      .addComment({ comment: 'Hi user !', blogId: 'sdd' })
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });
});

describe('getSearchedPosts', () => {
  it('should give error if database failure', (done) => {
    const db = { all: (query, callback) => callback('error') };
    const database = new Database(db);
    database.getSearchedPosts('error', 'venky').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the user posts', (done) => {
    const db = {
      all: (query, callback) => callback(null, [{ username: 'ramu', id: 7 }]),
    };
    const database = new Database(db);
    database.getSearchedPosts('author', 'ramu').then((actual) => {
      assert.deepStrictEqual(actual, [{ username: 'ramu', id: 7 }]);
      done();
    }, null);
  });
});
