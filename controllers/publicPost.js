const publicPostModel = require('../models/publicPost');
const publicPostUtils = require('../utils/publicPost');

async function getRemotePublicPost(postId) {
  const tweetData = await publicPostUtils.getPublicPost(postId);
  if(!tweetData) {
    throw 'could not retrieve post';
  }

  const postDetails = {
    id: tweetData.id_str,
    created_at: tweetData.created_at,
    full_text: tweetData.full_text,
    retweet_count: tweetData.retweet_count,
    favorite_count: tweetData.favorite_count,
    reply_count: tweetData.reply_count,
    quote_count: tweetData.quote_count,
    user_id: tweetData.user_id_str,
  };

  return postDetails;
}

async function getPublicPost(req, res) {
  try {
    let postDetails = await publicPostModel.getPublicPost(req.params.postId);

    if (!postDetails) {
      postDetails = await getRemotePublicPost(req.params.postId);

      const postDbDetails = Object.assign({
        post_id: postDetails.id,
        post_created_at: postDetails.created_at
      },
        postDetails);

      publicPostModel.savePublicPost(postDbDetails);
    } else {
      updatePublicPost(req.params.postId);
    }

    return res.send(postDetails);

  } catch (error) {
    console.error(error.message);
  }

  res.sendStatus(404);
}

function updatePublicPost(postId) {
  getRemotePublicPost(postId)
    .then((postDetails) => {
      const postDbDetails = Object.assign({
        post_id: postDetails.id,
        post_created_at: postDetails.created_at
      },
        postDetails);

      publicPostModel.updatePublicPost(postDbDetails);
    }).catch((error) => {console.error(error.message);});
}

module.exports = { getPublicPost };