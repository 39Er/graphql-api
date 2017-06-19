'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { schema, root } = require('./schema/schema');
const { logger, config } = require('./global');

const port = config.get('port');
const app = express();

app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false,
}));

app.get('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  logger.info('listening on %s', port);
});
