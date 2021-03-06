// initialize Knex client instance to create a connection pool for the current database
// see instructions in README.md
var knex;
var mockKnex = require('mock-knex');

// mock settings for integration tests
if (process.env.NODE_ENV === 'test') {
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'FAKE_DATABASE',
      debug: true
    }
  });
  mockKnex.mock(knex, 'knex@0.10');

// development and production settings
} else {
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : process.env.TANDEM_DB_HOST || '127.0.0.1',
      user     : 'tandem',
      password : process.env.TANDEM_DB_PW || 'oops',
      database : 'tandem',
      charset  : 'utf8'
    },
    useNullAsDefault: true
  });
}

// create a bookshelf instance on top of our knex client instance
// Note: bookshelf can drop down to raw knex interface whenever necessary
var bookshelf = require('bookshelf')(knex);

// Register models in a central location so that you can refer to them using a string in relations
// instead of having to require it every time.
// Helps deal with the challenges of circular module dependencies in Bookshelf/Node.
bookshelf.plugin('registry');

// Schema declarations occur in build.js during `npm run seed`
// this bookshelf instance will be used throughout our library
module.exports = bookshelf;
