async function init(adb) {
	await adb.run('CREATE TABLE IF NOT EXISTS inventory (name TEXT, item TEXT)')
}

async function update(db, characterName, inventory) {
	await db.run(`DELETE FROM inventory WHERE name = '${characterName}'`);

	var insertStmt = await db.prepare('INSERT INTO inventory VALUES(?, ?)');
	for(const item of inventory) {
		if (!item) continue;
		await insertStmt.run(characterName, item)
	}
	await insertStmt.finalize();
}

async function readAll(db) {
	return await db.all('SELECT name, item, COUNT(item) AS qty FROM inventory GROUP BY name, item')
}

async function readFiltered(db, filter) {
	return await db.all('SELECT name, item, COUNT(item) AS qty FROM inventory WHERE item LIKE "%' + filter + '%" GROUP BY name, item')
}

async function readCharacters(db) {
	return await db.all('SELECT name, COUNT(*) AS items FROM inventory GROUP BY name');
}

async function deleteCharacter(db, characterName) {
	return await db.run(`DELETE FROM inventory WHERE name = '${characterName}'`);
}

module.exports = {
	init,
	update,
	readAll,
	deleteCharacter,
	readFiltered,
	readCharacters,
}