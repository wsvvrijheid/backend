'use strict'

module.exports = async () => {
  try {
    const mentionList = await strapi.query('mention').find()
    const mentionUsers = mentionList.map(user => user.username)
    const twitterUsersData = await strapi.services.twitter.lookupUser(
      mentionUsers.join(', '),
    )
    await Promise.all(
      mentionUsers.map(async username => {
        const user_data = twitterUsersData.find(
          user => user.screen_name === username,
        )

        console.log(`user_data`, twitterUsersData)

        if (!user_data) return

        const validUserData = await strapi.entityValidator.validateEntityUpdate(
          strapi.models.mention,
          { user_data: user_data },
        )
        console.log(`validUserData`, validUserData)
        return strapi.query('mention').update({ username }, validUserData)
      }),
    )
  } catch (error) {
    console.error('Error while updating mention list', error)
  }
}
