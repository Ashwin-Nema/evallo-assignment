const express = require('express');

const router = express.Router();
const authRoute = require('./auth.route');
const calendarRoute = require('./calendar.route');

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/calendar',
    route: calendarRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
