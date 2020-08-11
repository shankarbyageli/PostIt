const Database = require('../src/database');
const assert = require('assert');
const sinon = require('sinon');

describe('addPost', () => {
  it('should give error if database failure in run', (done) => {
    const insert = sinon.stub().rejects('error');
    const newDb = sinon.stub().returns({ insert });

    const database = new Database(null, newDb);
    database
      .addPost({ id: 1, title: 'title', content: { time: '1' } }, 2)
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should add the post to database', (done) => {
    const insert = sinon.stub().resolves([1]);
    const newDb = sinon.stub().returns({ insert });

    const database = new Database(null, newDb);
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
    const where = sinon.stub().rejects('error');
    const update = sinon.stub().returns({ where });
    const newDb = sinon.stub().returns({ update });

    const database = new Database(null, newDb);
    database
      .updatePost(1, { title: 'title', content: { time: '1' } })
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should update the content of given post id', (done) => {
    const where = sinon.stub().resolves(true);
    const update = sinon.stub().returns({ where });
    const newDb = sinon.stub().returns({ update });
    const database = new Database(null, newDb);
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
    const where = sinon.stub().rejects('error');
    const update = sinon.stub().returns({ where });
    const insert = sinon.stub().resolves([1]);
    const newDb = sinon.stub().returns({ update, insert });

    const database = new Database(null, newDb);
    database.publishPost(1, [], 'path').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should not addTags if there are no tags', (done) => {
    const where = sinon.stub().resolves(true);
    const update = sinon.stub().returns({ where });
    const insert = sinon.stub().resolves([1]);
    const newDb = sinon.stub().returns({ update, insert });

    const addTags = sinon.stub().resolves(true);
    const database = new Database(null, newDb);
    database.addTags = addTags;

    database.publishPost(1, [], 'path').then((actual) => {
      assert.ok(actual);
      assert.equal(addTags.calledOnce, false);
      done();
    }, null);
  });

  it('should publish the drafted post', (done) => {
    const where = sinon.stub().resolves(true);
    const update = sinon.stub().returns({ where });
    const insert = sinon.stub().resolves([1]);
    const newDb = sinon.stub().returns({ update, insert });

    const addTags = sinon.stub().resolves(true);
    const database = new Database(null, newDb);
    database.addTags = addTags;
    database.publishPost(1, ['tag'], 'path').then((actual) => {
      assert.ok(actual);
      assert.ok(addTags.calledOnce);
      done();
    }, null);
  });
});

describe('getPost', () => {
  it('should give error if database failure', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getPost(2, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the post from database', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, null, true) };
    const database = new Database(db);
    database.getPost(2, 1).then((actual) => {
      assert.ok(actual);
      done();
    }, null);
  });
});

describe('getUsersPosts', () => {
  it('should give error if database failure', (done) => {
    const db = { all: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getUsersPosts(1, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get all the posts of given type from database', (done) => {
    const db = { all: sinon.stub().callsArgOnWith(1, null, null, [{}, {}]) };
    const database = new Database(db);
    database.getUsersPosts(1, 1).then((actual) => {
      assert.deepStrictEqual(actual, [{}, {}]);
      done();
    }, null);
  });
});

describe('getUserById', () => {
  it('should give error if database failure', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getUserById(2).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the user details of given id', (done) => {
    const db = {
      get: sinon.stub().callsArgOnWith(1, null, null, { username: 'ramu' }),
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
    const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, 'error') };
    const database = new Database(db);
    database
      .addUser({ login: 'kaka', avatarUrl: 'https://img.com' })
      .then(null, (actual) => {
        assert.equal(actual, 'error');
        done();
      });
  });

  it('should add the given user details to users table and return true', (done) => {
    const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, null) };
    const database = new Database(db);
    database
      .addUser({ login: 'kaka', avatarUrl: 'https://img.com' })
      .then((actual) => {
        assert.ok(actual);
        done();
      }, null);
  });
});

describe('getUser', () => {
  it('should give error if database failure', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getUser('mama').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get user details of given id', (done) => {
    const db = {
      get: sinon.stub().callsArgOnWith(1, null, null, { userId: 7 }),
    };
    const database = new Database(db);
    database.getUser('mama').then((actual) => {
      assert.deepStrictEqual(actual, { userId: 7 });
      done();
    }, null);
  });

  it('should return false if user id does not exist', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, null, null) };
    const database = new Database(db);
    database.getUser('mama').then((actual) => {
      assert.equal(actual, false);
      done();
    }, null);
  });
});

describe('getLatestPosts', () => {
  it('should give error if database failure', (done) => {
    const db = { all: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getLatestPosts(5).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the latest posts', (done) => {
    const db = {
      all: sinon
        .stub()
        .callsArgOnWith(1, null, null, [{ username: 'ramu', id: 7 }]),
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
    const db = { all: sinon.stub().callsArgOnWith(1, null, null, true) };
    const database = new Database(db);
    database.getComments(1).then((actual) => {
      assert.ok(actual);
      done();
    }, null);
  });

  it('should give error for database failure ', (done) => {
    const db = { all: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getComments('ab').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });
});

describe('addComment', () => {
  it('should give error if database failure', (done) => {
    const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, 'error') };
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
    const db = { all: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.getSearchedPosts('error', 'venky').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should get the user posts', (done) => {
    const db = {
      all: sinon
        .stub()
        .callsArgOnWith(1, null, null, [{ username: 'ramu', id: 7 }]),
    };
    const database = new Database(db);
    database.getSearchedPosts('author', 'ramu').then((actual) => {
      assert.deepStrictEqual(actual, [{ username: 'ramu', id: 7 }]);
      done();
    }, null);
  });
});

describe('addImage', () => {
  it('should give error if database failure', (done) => {
    const db = {
      get: sinon.stub().callsArgOnWith(1, null, 'error'),
      run: sinon.stub().callsArgOnWith(1, null, null, true),
      serialize: sinon.stub().callsArgOnWith(0, null),
    };
    const database = new Database(db);
    database.addImage('myFile').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should give error if database failure', (done) => {
    const db = {
      get: sinon.stub().callsArgOnWith(1, null, null),
      run: sinon.stub().callsArgOnWith(1, null, 'error'),
      serialize: sinon.stub().callsArgOnWith(0, null),
    };
    const database = new Database(db);
    database.addImage('myFile').then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should add image to the database', (done) => {
    const db = {
      serialize: sinon.stub().callsArgOnWith(0, null),
      get: sinon.stub().callsArgOnWith(1, null, null, 1),
      run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, null),
    };
    const database = new Database(db);
    database.addImage('myFile').then((actual) => {
      assert.equal(actual, 1);
      done();
    }, null);
  });
});

describe('addTags', () => {
  it('should give error if database failure', (done) => {
    const insert = sinon.stub().rejects('error');
    const newDb = sinon.stub().returns({ insert });
    const database = new Database(null, newDb);
    database.addTags(['tag1']).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should add the tag', (done) => {
    const insert = sinon.stub().resolves(true);
    const newDb = sinon.stub().returns({ insert });
    const database = new Database(null, newDb);
    database.addTags(['tag1'], 1).then((actual) => {
      assert.equal(actual, true);
      done();
    });
  });
});

describe('isClapped', () => {
  it('should give error if database failure', (done) => {
    const db = { get: sinon.stub().callsArgOnWith(1, null, 'error') };
    const database = new Database(db);
    database.isClapped(1, 2).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it(
    'should give false if the user is already clapped',
    (done) => {
      const db = { get: sinon.stub().callsArgOnWith(1, null, null, false) };
      const database = new Database(db);
      database.isClapped(3, 1).then((actual) => {
        assert.equal(actual, false);
        done();
      });
    },
    null
  );
});

describe('clapOnPost', () => {
  it('should give error if database failure', (done) => {
    const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, 'error') };
    const database = new Database(db);
    database.isClapped = sinon.fake.resolves(true);
    database.clapOnPost(1, 2).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it(
    'should be able to unclap on post if the user is already clapped',
    (done) => {
      const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, null) };
      const database = new Database(db);
      database.isClapped = sinon.fake.resolves(true);
      database.clapOnPost(3, 1).then((actual) => {
        assert.equal(actual, false);
        done();
      });
    },
    null
  );

  it(
    'should be able to clap on post if the user is not already clapped',
    (done) => {
      const db = { run: sinon.stub().callsArgOnWith(1, { lastID: 1 }, null) };
      const database = new Database(db);
      database.isClapped = sinon.fake.resolves(false);
      database.clapOnPost(3, 1).then((actual) => {
        assert.equal(actual, true);
        done();
      });
    },
    null
  );
});

describe('updateProfile', () => {
  it('should update the displayName if just name is edited', (done) => {
    const db = {};
    const database = new Database(db);
    database.run = sinon.stub().resolves(true);
    database.updateProfile(1, {}).then(() => {
      assert.ok(database.run.calledOnce);
      done();
    });
  });

  it('should update avatarUrl if new image is uploaded', (done) => {
    const db = {};
    const database = new Database(db);
    database.run = sinon.stub().resolves(true);
    database.updateProfile(1, { avatarUrl: '/user/image' }).then(() => {
      assert.ok(database.run.calledTwice);
      done();
    });
  });
});

describe('getPostDetails', () => {
  it('should give error if database failure', (done) => {
    const db = {
      serialize: sinon.stub().callsArgOnWith(0, null),
      all: sinon.stub().callsArgOnWith(1, null, null),
      get: sinon.stub().callsArgOnWith(1, null, 'error'),
    };
    const database = new Database(db);
    database.getPostDetails(1, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should give error if database failure', (done) => {
    const db = {
      serialize: sinon.stub().callsArgOnWith(0, null),
      all: sinon.stub().callsArgOnWith(1, null, 'error'),
      get: sinon.stub().callsArgOnWith(1, null, null, { imagePath: 'path' }),
    };
    const database = new Database(db);
    database.getPostDetails(1, 1).then(null, (actual) => {
      assert.equal(actual, 'error');
      done();
    });
  });

  it('should add the tags to details if tags are there', (done) => {
    const db = {
      serialize: sinon.stub().callsArgOnWith(0, null),
      all: sinon
        .stub()
        .callsArgOnWith(1, null, null, [{ tag: 't1' }, { tag: 't2' }]),
      get: sinon.stub().callsArgOnWith(1, null, null, { imagePath: 'path' }),
    };
    const database = new Database(db);
    database.getPostDetails(1, 1).then((actual) => {
      assert.deepStrictEqual(actual, { imagePath: 'path', tags: ['t1', 't2'] });
      done();
    });
  });
});
