'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const schema = require('./schema/schema');
const { logger, config } = require('./global');

const port = config.get('port');
const app = express();
const dburl = 'mongodb://' + config.get('mongo.host')
  + ':' + config.get('mongo.port') + '/' + config.get('mongo.dbName');

//  connect redis
const redisClient = redis.createClient(config.get('redis'));
redisClient.on('error', (err) => {
  logger.error(err);
  process.exit(1);
});

app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'ACDataServer',
  cookie: {
    maxAge: 12 * 60 * 60 * 1000,
  },
  proxy: true,
  saveUninitialized: true,
  resave: false,
}));

app.use('/graphql', graphqlHTTP({
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
