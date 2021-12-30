const { sanitizeEntity } = require('strapi-utils')

module.exports = {
  '*/15 * * * *': {
    task: async () => {
      const woeids = {
        en: 1,
        tr: 23424969,
        nl: 23424909,
      }

      const entities = await Promise.all(
        Object.entries(woeids).map(async ([locale, id]) => {
          try {
            const result = await strapi.hook.twitter.getTrends(id)

            if (!Array.isArray(result)) return

            if (!result[0]) return

            const data = result[0].trends

            return strapi.services.trend.createOrUpdate({ [locale]: data })
          } catch (error) {
            console.error(error)
          }
        }),
      )

      entities.forEach(entity =>
        sanitizeEntity(entity, { model: strapi.models.trend }),
      )
    },
  },
  '*/5 * * * *': {
    task: async () => {
      const date = new Date(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).toISOString()

      const hashtags = await strapi.services.hashtag.find({
        date_gte: date,
      })

      hashtags.map(async h => {
        try {
          const { id, hashtag } = h

          const result = await strapi.hook.twitter.searchTweets(hashtag)

          if (result && result.statuses) {
            const tweets = result.statuses
            const mappedTweets = tweets.map(data => {
              let image = undefined
              let videos = undefined

              const id = data.id
              const { name, screen_name, profile_image_url_https } = data.user
              const user = {
                name,
                username: screen_name,
                profile: profile_image_url_https,
              }
              const text = data.text
              const likes = data.favorite_count
              const retweets = data.retweet_count

              if (
                data &&
                data.extended_entities &&
                data.extended_entities.media &&
                data.extended_entities.media[0]
              ) {
                image = data.extended_entities.media[0].media_url_https
                videos =
                  (data.extended_entities.media[0].video_info &&
                    data.extended_entities.media[0].video_info.variants) ||
                  undefined
              }

              return {
                id,
                user,
                text,
                image,
                videos,
                likes,
                retweets,
              }
            })

            await strapi.services.hashtag.update(
              { id },
              { tweets: mappedTweets },
            )
          }
        } catch (error) {
          console.log(`Error while searching tweets`, error)
        }
      })
    },
  },
}
