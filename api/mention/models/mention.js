'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate(result) {
      strapi.services.twitter.lookupUser(result.username).then(data => {
        strapi
          .query('mention')
          .update({ username: result.username }, { user_data: data[0] })
      })
    },
  },
}
