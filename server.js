const app = require('./src/app.js');

const PORT = process.env.PORT || 8000;
const db_path = process.env.db;
app.locals.db_path = db_path;
app.listen(PORT, () => console.log('server is listening', PORT));
