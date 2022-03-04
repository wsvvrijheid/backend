'use strict'
const tesseract = require('node-tesseract-ocr')

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

        try {
          const text = await tesseract.recognize(
            `http://localhost:1337${imageUrl}`,
            {
              lang: locales[result.locale],
              oem: 3,
              psm: 3,
            },
          )
          await strapi.query('hashtag-post').update({ id: result.id }, { text })
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
}
