const trends = (client, errorHandler, debug) => {
  return {
    /**
     * get home timeline
     *
     * @param {number} woeid
     **/
    getTrends: async function (woeid = 20) {
      try {
        const response = await client.get('trends/place', {
          id: woeid,
        })

        console.log('twitter hook - get trends: ', response)

        return Promise.resolve(response)
      } catch (error) {
        if (debug) errorHandler(error)
        return Promise.reject(error)
      }
    },
  }
}

exports.trends = trends
