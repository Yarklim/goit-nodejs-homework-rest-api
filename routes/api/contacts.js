const express = require('express');
const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId, authenticate } = require('../../middlewares');
const { schemas } = require('../../models/contact');
const router = express.Router();

router.use(authenticate);

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
  isValidId,
  validateBody(schemas.updateFavoriteSchema, `missing field favorite`),
  ctrl.updateFavorite
);

router.delete('/:id', isValidId, ctrl.deleteContact);

module.exports = router;
