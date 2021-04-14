const db = require('./db');

const TABLE_NAME = 'public_post';
const COLUMNS = ['id', 'post_id', 'user_id', 'post_created_at', 'full_text', 'retweet_count', 'favorite_count', 'reply_count', 'quote_count', 'created_at', 'updated_at'];
const UPDATEABLE_COLUMNS = ['post_id', 'user_id', 'post_created_at', 'full_text', 'retweet_count', 'favorite_count', 'reply_count', 'quote_count'];

async function getPublicPost(postId) {
  const dbResult = await db.pool.query(`SELECT ${UPDATEABLE_COLUMNS.join(',')} FROM ${TABLE_NAME} WHERE post_id = $1::text`, [postId]);
  return dbResult.rows[0];
}

function savePublicPost(publicPostParams) {
  const query = `
    INSERT INTO ${TABLE_NAME} 
      (${UPDATEABLE_COLUMNS.join(',')})
      VALUES
        (${UPDATEABLE_COLUMNS.map((col, idx) => (`$${idx + 1}`)).join(',')})
      `;

  return db.pool.query(query,
    UPDATEABLE_COLUMNS.map((key) => (publicPostParams[key])));
}

function updatePublicPost(publicPostParams) {
  const query = `
    UPDATE ${TABLE_NAME}
      SET ${UPDATEABLE_COLUMNS.map((col, idx) => (`${col}=$${idx + 1}`))}
      WHERE post_id = $${UPDATEABLE_COLUMNS.length + 1}::text
  `;

  let values = UPDATEABLE_COLUMNS.map((colName) => (publicPostParams[colName]));
  values.push(publicPostParams.post_id);

  db.pool.query(query, values);
}

module.exports = { getPublicPost, savePublicPost, updatePublicPost };