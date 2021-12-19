module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '818ac1ba3bb050bd65aa2e59df4b0d79'),
    },
  },
  cron: {
    enabled: true,
  },
})
