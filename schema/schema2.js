'use strict';

const { buildSchema } = require('graphql');
const RandomDie = require('./RandomDie');
const Message = require('./Message');

const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  `);
let fakeDatebase = {};

const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(value => value + Math.floor(Math.random() * 6));
  },
  rollDice: function ({ numDice, numSides }) {
    let output = [];
    for (let i = 0; i < numDice; i += 1) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
  },
  getMessage: function ({ id }) {
    console.log(id);
    if (!fakeDatebase[id]) {
      throw new Error('no message exists with id' + id);
    }
    return new Message(id, fakeDatebase[id]);
  },
  createMessage: function ({ input }) {
    let id = require('crypto').randomBytes(10).toString('hex');
    fakeDatebase[id] = input;
    return new Message(id, input);
  },
  updateMessage: function ({ id, input }) {
    if (!fakeDatebase[id]) {
      throw new Error('no message exists with id' + id);
    }
    fakeDatebase[id] = input;
    return new Message(id, input);
  },
};

module.exports.root = root;
module.exports.schema = schema;
