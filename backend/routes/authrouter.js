import express from 'express'
import passport from 'passport'
import { logoutAllCont,logoutCont, oAuthCallback, refreshAccessToken } from '../controllers/authcontroller.js'
const router = express.Router()

// Placeholder for authentication-related endpoints

router.get('/github',passport.authenticate('github',{scope: ['user:email']}))

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure', session: false }),
  oAuthCallback
);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', logoutCont);

router.post('/logout-all', passport.authenticate('jwt', { session: false }), logoutAllCont);

export default router
