'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const HOST = '0.0.0.0';

let RuleEngine = require("node-rules");

/* Creating Rule Engine instance */
let R = new RuleEngine();

/* Add a rule */
let rule = {
  "condition": function (R) {
    R.when(this.transactionTotal < 500);
  },
  "consequence": function (R) {
    this.result = false;
    this.reason = "The transaction was blocked as it was less than 500";
    R.stop();
  }
};

/* Register Rule */
R.register(rule);

const app = express();

app.use(bodyParser.json({
  limit: '100k',
}));

app.get('/', function(req, res, next) {
  res.json({'msg': 'Rules API is functional'})
});

app.get('/rule/:value', function(req, res, next) {
  let value = req.params.value;
  let fact = { "transactionTotal": value };

  /* Check if the engine blocks it! */
  R.execute(fact, function (data) {
    if (data.result) {
      console.log("Valid transaction");
      res.json({'msg': 'Valid transaction'});
    } else {
      console.log(data.reason);
      res.json({'msg': data.reason});
    }
  });
});

app.listen(PORT, HOST);

console.log('Listening on http://%s:%d', HOST || '*', PORT);

/**
 * Export the Express app so that it can be used by Chai
 */
module.exports = app;
