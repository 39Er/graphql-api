'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { schema, root } = require('./schema/schema');

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


app.listen(3000, () => {
  console.log('listening on 3000');
});
