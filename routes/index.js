var express = require('express');
var inventoryModel = require('../models/inventory.js')
var _ = require('lodash');

var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  var db = req.app.get('db')
  var query = req.query.q || '';

  var characters = await inventoryModel.readCharacters(db);
  var {totalItems} = await inventoryModel.readCount(db);
  var inventory = query
    ? await inventoryModel.readFiltered(db, query)
    : await inventoryModel.readAll(db)

  // Calculate some basic stats on inventory returned.
  var inventoryStats = {
    characters: characters.length,
    items: totalItems,
  }

  if (query !== '') {
    inventoryStats.characters = _.uniq(_.map(inventory, 'name')).length;
    inventoryStats.items = _.sum(_.map(inventory, 'qty'));
  } 

  res.render('index', {
    title: 'Inventory Manager',
    characters,
    inventory,
    inventoryStats,
    totalItems,
    query,
  });
});

router.post('/', async (req, res, next) => {
  var db = req.app.get('db')
  var characterName = req.body.character
  var rows = req.body.inventory.split('\r\n');

  // Strip a | an | some from the start of all inventory items
  var parseInvRow = /^(a|an|some) (.*)/i;
  rows = rows.map((row) => {
    if (!row) return;

    var [all, prefix, item] = row.match(parseInvRow);

    return item;
  })

  await inventoryModel.update(db, characterName, rows);

  res.redirect('/')
});

router.get('/character/delete/:name', async (req, res, next) => {
  var db = req.app.get('db')
  await inventoryModel.deleteCharacter(db, req.params.name)
  res.redirect('/');
})

module.exports = router;
