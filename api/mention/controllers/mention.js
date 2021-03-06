'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async search(ctx) {
    try {
      return await strapi.hook.twitter.searchUser(ctx.query.username)
    } catch (error) {
      return error
    }
  },
}
