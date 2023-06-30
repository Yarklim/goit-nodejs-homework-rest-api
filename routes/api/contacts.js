const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/contacts');

const { validateBody } = require('../../middlewares');

const schemas = require('../../schemas/contacts');

router.get('/', ctrl.getContacts);

router.get('/:id', ctrl.getContactById);

router.post('/', validateBody(schemas.addSchema), ctrl.addNewContact);

router.delete('/:id', ctrl.deleteContact);

router.put('/:id', validateBody(schemas.addSchema), ctrl.getContactById);

module.exports = router;
