require('dotenv').config();
const {NODE_ENV} = process.env;
const {
  users,
  cocktails,
  comments,
} = require('./fake_data');
const {query, end} = require('../utils/mysqlcon');
const crypto = require('crypto');
const SecrectKEY = process.env.SecrectKEY;

function _createFakeUser() {
  const encryped_users = users.map((user) => {
    const encryped_user = {
      provider: user.provider,
      email: user.email,
      password: user.password ? crypto.createHash('sha256').update(user.password+SecrectKEY).digest('hex') : null,
      name: user.name,
      photo: user.photo,
    };
    return encryped_user;
  });
  return query('INSERT INTO user (provider, email, password, name, photo) VALUES ?', [encryped_users.map((user) => Object.values(user))]);
}

function _createFakeCocktails() {
  return query('INSERT INTO cocktails (category, name, description, ori_image, resource, link, author, ingredients, steps, createdAt,author_id) VALUES ?', [cocktails.map((cocktail) => Object.values(cocktail))]);
}

function _createFakeComments() {
  return query('INSERT INTO comments (user_id, cocktail_id, comment, tonight_test.comments.rank , img, title) VALUES ?', [comments.map((comment) => Object.values(comment))]);
}

function createFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }

  return _createFakeUser()
      .then(_createFakeCocktails)
      .then(_createFakeComments)
      .catch(console.log);
}

function truncateFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }
  console.log('truncate fake data');
  // const setForeignKey = (status) => {
  //     return query('SET FOREIGN_KEY_CHECKS = ?', status);
  // };

  const truncateTable = (table) => {
    return query(`TRUNCATE TABLE ${table}`);
  };
  const setForeignKey = (status) => {
    return query('SET FOREIGN_KEY_CHECKS = ?', status);
  };

  return setForeignKey(0)
      .then(truncateTable('user'))
      .then(truncateTable('user_like_join'))
      .then(truncateTable('user_subscribe_join'))
      .then(truncateTable('comments'))
      .then(truncateTable('cocktails'))
      .then(setForeignKey(1))
      .catch(console.log);
}

function closeConnection() {
  return end();
}

// execute when called directly.
if (require.main === module) {
  console.log('main');
  truncateFakeData()
      .then(createFakeData)
      .then(closeConnection);
}

module.exports = {
  createFakeData,
  truncateFakeData,
  closeConnection,
};
