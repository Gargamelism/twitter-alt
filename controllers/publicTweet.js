const publicTweetModel = require('../models/publicTweet');
const publicTweetUtils = require('../utils/publicTweet');

function tweetFormatToDBFormat(tweetData, users) {
  return {
    user_name:          users[tweetData.user_id_str].name,
    tweet_id:           tweetData.id_str,
    tweet_created_at:   tweetData.created_at,
    full_text:          tweetData.full_text,
    retweet_count:      tweetData.retweet_count,
    favorite_count:     tweetData.favorite_count,
    reply_count:        tweetData.reply_count,
    quote_count:        tweetData.quote_count,
    user_id:            tweetData.user_id_str,
    reply_to_tweet_id:  tweetData.in_reply_to_status_id_str,
  };
}

async function getRemotePublicTweet(tweetId) {
  const { tweets, users } = await publicTweetUtils.getPublicTweet(tweetId);
  if (!tweets) {
    throw 'could not retrieve tweet';
  }

  const mainTweet = tweetFormatToDBFormat(tweets[tweetId], users);

  new Promise(() => {
    Object.keys(tweets).forEach((currentTweetId) => {
      const tweet = tweetFormatToDBFormat(tweets[currentTweetId], users);
      publicTweetModel.savePublicTweet(tweet);
    });
  }).catch((error) => { console.error(`failed to save tweet comments of tweet <${tweetId}> with error <${error.message}>`) });

  return mainTweet;
}

async function getPublicTweet(req, res) {
  try {
    let tweetDetails = await publicTweetModel.getPublicTweet(req.params.tweetId);

    if (!tweetDetails) {
      tweetDetails = await getRemotePublicTweet(req.params.tweetId);

      const tweetDbDetails = Object.assign({
        tweet_id: tweetDetails.id,
        tweet_created_at: tweetDetails.created_at
      },
        tweetDetails);

      publicTweetModel.savePublicTweet(tweetDbDetails);
    } else {
      updatePublicTweet(req.params.tweetId);
    }

    return res.send(tweetDetails);

  } catch (error) {
    console.error(error.message);
  }

  res.sendStatus(404);
}

function updatePublicTweet(tweetId) {
  getRemotePublicTweet(tweetId)
    .then((tweetDetails) => {
      const tweetDbDetails = Object.assign({
        tweet_id: tweetDetails.id,
        tweet_created_at: tweetDetails.created_at
      },
        tweetDetails);

      publicTweetModel.updatePublicTweet(tweetDbDetails);
    }).catch((error) => { console.error(error.message); });
}

module.exports = { getPublicTweet };