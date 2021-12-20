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
        Object.entities(woeids).map(async ([locale, id]) => {
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
}
