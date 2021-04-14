const axios = require('axios');
const network = require('./network');

function getPublicPost(postID) {  
  return axios.get(`https://twitter.com/i/api/2/timeline/conversation/${postID}.json`, {
    responseType: 'json',
    headers: {
      authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'user-agent': network.getUserAgent(),
      'x-csrf-token': 'd59b1c51879d189fbe3b6f9529fe66ee',
      'x-guest-token': '1382020432832954368',
      'x-twitter-active-user': 'yes',
      Accept: '*/*',
      'Accept-Language': 'en- US, en; q = 0.5',
      'Accept-Encoding': 'UTF-8',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      TE: 'Trailers',
      Host: 'twitter.com',
      Referrer: `https://twitter.com/`
    },
    params: {
      include_profile_interstitial_type: 1,
      include_blocking: 1,
      include_blocked_by: 1,
      include_followed_by: 1,
      include_want_retweets: 1,
      include_mute_edge: 1,
      include_can_dm: 1,
      include_can_media_tag: 1,
      skip_status: 1,
      include_cards: 1,
      include_ext_alt_text: true,
      include_quote_count: true,
      include_reply_count: 1,
      tweet_mode: 'extended',
      include_entities: true,
      include_user_entities: true,
      include_ext_media_color: true,
      include_ext_media_availability: true,
      send_error_codes: true,
      simple_quoted_tweet: true,
      count: 1,
      include_ext_has_birdwatch_notes: false,
    }
  })
    .then((response) => {
      return response.data.globalObjects.tweets[postID];
    })
    .catch((error) => { console.error(error.message); })
}

module.exports = { getPublicPost };