const express = require('express');
const router = express.Router();
const { adminLogin , getuser} = require('../controllers/admincontroller');

router.post('/login', adminLogin);
router.get('/user/:id', getuser);
module.exports = router;