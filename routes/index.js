var express = require('express');
var inventoryModel = require('../models/inventory.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  inventoryModel.readCharacters((err, names) => {
    console.log(req.query.q)
    if (req.query.q) {
      inventoryModel.readFiltered(req.query.q, (err, inventory) => {
        res.render('index', {
          title: 'Express',
          characters: names,
          inventory,
          query: req.query.q
        });
      })
    } else {
      inventoryModel.readAll((err, inventory) => {
        res.render('index', {
          title: 'Express',
          characters: names,
          inventory,
          query: '',
        });
      })
    }
  });
});

router.post('/', function(req, res, next) {

  var parseInvRow = /^(a|an|some) (.*)/i;
  var rows = req.body.inventory.split('\r\n');
  rows = rows.map((row) => {
    if (!row) return;

    var [all, prefix, item] = row.match(parseInvRow);

    return item;
  })

  // res.send('<pre>' + JSON.stringify(rows, undefined, '  ') + '</pre>');

  inventoryModel.update(req.body.character, rows, () => {
    res.redirect('/')
  });
});

router.get('/character/delete/:name', (req, res, next) => {
  inventoryModel.deleteCharacter(req.params.name, () => {
    res.redirect('/');
  })
})

module.exports = router;
