'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const { logger, config } = require('./global');

const port = config.get('port');
const app = express();
const dburl = 'mongodb://' + config.get('mongo.host')
  + ':' + config.get('mongo.port') + '/' + config.get('mongo.dbName');

app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: false,
}));

app.get('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  mongoose.connect(dburl, (error) => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }
  });
  logger.info('listening on %s', port);
});
