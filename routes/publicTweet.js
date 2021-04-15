var express = require('express');
var router = express.Router();

const { getPublicTweet, getTweetComments } = require('../controllers/publicTweet');

router.get('/:tweetId/comments', getTweetComments);
router.get('/:tweetId', getPublicTweet);

module.exports = router;
