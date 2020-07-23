const express = require('express');
const userRouter = express.Router();

const { publish, ensureLogin } = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));
userRouter.post('/publish', publish);

module.exports = { userRouter };
