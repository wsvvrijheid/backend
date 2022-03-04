'use strict'
const { createWorker } = require('tesseract.js')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const locales = {
  nl: 'nld',
  tr: 'tur',
  en: 'eng',
}

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      if (result.image) {
        const imageUrl = result.image.url
        const worker = createWorker({
          logger: m => console.log(m),
        })

        try {
          await worker.load()
          await worker.loadLanguage(locales[result.locale])
          await worker.initialize(locales[result.locale])
          const response = await worker.recognize(
            `https://samen-strapi-pr-17.onrender.com${imageUrl}`,
          )

          await strapi
            .query('hashtag-post')
            .update({ id: result.id }, { text: response.data.text })
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
}
