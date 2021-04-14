var express = require('express');
var router = express.Router();

const { getPublicPost } = require('../controllers/publicPost');

router.get('/:postId', getPublicPost);

module.exports = router;
