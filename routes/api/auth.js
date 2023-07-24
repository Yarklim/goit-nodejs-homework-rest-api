const express = require('express');
const authCtrl = require('../../controllers/auth-ctrl');
const { validateBody, authenticate, upload } = require('../../middlewares');
const { schemas } = require('../../models/user');

const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  authCtrl.register
);

router.get('/verify/:verificationToken', authCtrl.verifyUserEmail);

router.post(
  '/verify',
  validateBody(schemas.verifyEmailSchema),
  authCtrl.resendVerifyEmail
);

router.post('/login', validateBody(schemas.loginSchema), authCtrl.login);

router.get('/current', authenticate, authCtrl.getCurrent);

router.post('/logout', authenticate, authCtrl.logout);

router.patch(
  '/',
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  authCtrl.updateSubscription
);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authCtrl.updateAvatar
);

module.exports = router;
