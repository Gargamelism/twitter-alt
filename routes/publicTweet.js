var express = require('express');
var router = express.Router();

const { getPublicTweet } = require('../controllers/publicTweet');

router.get('/:tweetId', getPublicTweet);

module.exports = router;
