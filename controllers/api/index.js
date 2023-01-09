const router = require('express').Router();
const user = require('./user');
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/user', user);


module.exports = router;