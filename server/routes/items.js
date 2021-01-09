const express = require('express');
const itemController = require('../controllers/items');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, itemController.createItem);

router.put("/:id", checkAuth, itemController.UpdateItem);

router.get('', checkAuth, itemController.getItems);

router.get("/:id", checkAuth, itemController.getItem);

router.delete("/:id", checkAuth, itemController.deleteItem);

module.exports = router;
