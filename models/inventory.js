const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(`${__dirname}/../data.sqlite`)

function init() {
	db.serialize(() => {
		db.run('CREATE TABLE IF NOT EXISTS inventory (name TEXT, item TEXT)')
	})
}

function update(characterName, inventory, cb) {
	db.serialize(() => {
		db.run(`DELETE FROM inventory WHERE name = '${characterName}'`);

		var insertStmt = db.prepare('INSERT INTO inventory VALUES(?, ?)');
		for(const item of inventory) {
			if (!item) continue;
			insertStmt.run(characterName, item)
		}
		insertStmt.finalize();

		cb();
	})
}

function readAll(cb) {
	db.serialize(() => {
		db.all('SELECT name, item, COUNT(item) AS qty FROM inventory GROUP BY name, item', cb)
	})
}

function readFiltered(filter, cb) {
	db.serialize(() => {
		db.all('SELECT name, item, COUNT(item) AS qty FROM inventory WHERE item LIKE "%' + filter + '%" GROUP BY name, item', cb)
	})
}

function readCharacters(cb) {
	db.serialize(() => {
		db.all('SELECT name, COUNT(*) AS items FROM inventory GROUP BY name', cb);
	})
}

function deleteCharacter(characterName, cb) {
	db.serialize(() => {
		db.run(`DELETE FROM inventory WHERE name = '${characterName}'`, cb);
	});
}


module.exports = {
	init,
	update,
	readAll,
	deleteCharacter,
	readFiltered,
	readCharacters,
}