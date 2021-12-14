const express = require('express');

const {Router} = express;
const router = new Router();

const user = require('./user');
const location = require('./locations');
const session = require('./session');

router.use('/api/users', user);
router.use('/api/location', location);
router.use('/api/sessions', session);

module.exports = router;
