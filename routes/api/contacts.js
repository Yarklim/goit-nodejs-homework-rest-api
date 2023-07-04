const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId } = require('../../middlewares');

const { schemas } = require('../../models/contact');

router.get('/', ctrl.getContacts);

router.get('/:id', isValidId, ctrl.getContactById);

router.post(
  '/',
  validateBody(schemas.addSchema, `missing fields`),
  ctrl.addNewContact
);

router.put(
  '/:id',
  isValidId,
  validateBody(schemas.addSchema, `missing fields`),
  ctrl.getContactById
);

router.patch(
  '/:id/favorite',
  validateBody(schemas.updateFavoriteSchema, `missing field favorite`),
  ctrl.updateFavorite
);

router.delete('/:id', isValidId, ctrl.deleteContact);

module.exports = router;
