class Database {
  constructor(db) {
    this.db = db;
  }
  addPost(data) {
    const query = `INSERT INTO stories (title,content,last_modified) values (
      '${data.title}','${JSON.stringify(data.content)}','${
      data.content.time
    }');`;
    console.log(query);
    this.db.run(query, (res) => {
      console.log(res);
    });
  }
}

module.exports = Database;
