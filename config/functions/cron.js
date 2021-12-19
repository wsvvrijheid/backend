const { sanitizeEntity } = require('strapi-utils')

module.exports = {
  /**
   * Cron job with timezone example.
   * Every Monday at 1am for Asia/Dhaka timezone.
   * List of valid timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List
   */

  '*/15 * * * *': {
    task: async () => {
      const woeids = {
        en: 1,
        tr: 23424969,
        nl: 23424909,
      }

      Object.entries(woeids).map(async ([locale, id]) => {
        const result = await strapi.hook.twitter.getTrends(id)

        if (!Array.isArray(result)) return

        if (!result[0]) return

        const data = result[0].trends

        const entity = await strapi.services.trend.createOrUpdate({
          [locale]: data,
        })
        return sanitizeEntity(entity, { model: strapi.models.trend })
      })
    },
  },
}
