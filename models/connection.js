var sqlite3 = require('sqlite3');
var { open } = require('sqlite');

async function openDb() {
  return open({
    filename: `${__dirname}/../data.sqlite`,
    driver: sqlite3.Database,
  });
}

module.exports = {
	openDb,
}