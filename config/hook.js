module.exports = ({ env }) => ({
  settings: {
    twitter: {
      enabled: true, // set to enable the hook
      debug: true, // to log the data
      consumer_key: env('TWITTER_CONSUMER_KEY'),
      consumer_secret: env('TWITTER_CONSUMER_SECRET'),
      access_token_key: env('TWITTER_ACCESS_TOKEN'),
      access_token_secret: env('TWITTER_ACCESS_TOKEN_SECRET'),
    },
  },
})
