const express = require('express');
const router = express.Router();

// Item Model and Controller
const User = require('../../models/Users');
const usersController = require('../../controllers/usersController');

// @route GET api/items
// @desc Get All Items
// @access Public
/*
router.get('/', (req, res) => {
    User.find()
        .sort({date: -1})
        .then(users => res.json(users))
});
*/

// Chainable route handler, execute different functionalities depending on the type of request
router.route('/')
    .get(usersController.getAllUser)
    .post(usersController.createUser)

// @route POST api/items
// @desc Create A Post
// @access Public

// @route DELETE api/items/:id
// @desc Create A Item
// @access Public


module.exports = router;