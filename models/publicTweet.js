const db = require('./db');

const TABLE_NAME = 'public_tweet';
const COLUMNS = ['id', 'tweet_id', 'user_id', 'user_name', 'reply_to_tweet_id', 'tweet_created_at', 'full_text', 'retweet_count', 'favorite_count', 'reply_count', 'quote_count', 'created_at', 'updated_at'];
const UPDATEABLE_COLUMNS = ['tweet_id', 'user_id', 'user_name', 'reply_to_tweet_id', 'tweet_created_at', 'full_text', 'retweet_count', 'favorite_count', 'reply_count', 'quote_count'];

async function getPublicTweet(tweetId) {
  const dbResult = await db.pool.query(`SELECT ${UPDATEABLE_COLUMNS.join(',')} FROM ${TABLE_NAME} WHERE tweet_id = $1::text`, [tweetId]);
  return dbResult.rows[0];
}

function savePublicTweet(publicPostParams) {
  let count = 1;
  const query = `
    INSERT INTO ${TABLE_NAME} 
      (${UPDATEABLE_COLUMNS.join(',')})
      VALUES
        (${UPDATEABLE_COLUMNS.map(() => (`$${count++}`)).join(',')})
      ON CONFLICT (tweet_id)
      DO
        UPDATE SET ${UPDATEABLE_COLUMNS.map((col) => (`${col}=$${count++}`))}`;

  const vals = UPDATEABLE_COLUMNS.map((key) => (publicPostParams[key]));
  return db.pool.query(query,
    [...vals, ...vals]);
}

function updatePublicTweet(publicPostParams) {
  const query = `
    UPDATE ${TABLE_NAME}
      SET ${UPDATEABLE_COLUMNS.map((col, idx) => (`${col}=$${idx + 1}`))}
      WHERE tweet_id = $${UPDATEABLE_COLUMNS.length + 1}::text
  `;

  let values = UPDATEABLE_COLUMNS.map((colName) => (publicPostParams[colName]));
  values.push(publicPostParams.tweet_id);

  db.pool.query(query, values);
}

async function getTweetComments(tweetId) {
  const dbResult = await db.pool.query(`SELECT ${UPDATEABLE_COLUMNS.join(',')} FROM ${TABLE_NAME} WHERE reply_to_tweet_id = $1::text`, [tweetId]);
  return dbResult.rows;
}

module.exports = { getPublicTweet, savePublicTweet, updatePublicTweet, getTweetComments };