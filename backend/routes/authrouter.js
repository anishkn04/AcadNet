import express from 'express'
import passport from 'passport'
import { logoutAllCont,logoutCont, oAuthCallback, refreshAccessToken,checkedRes} from '../controllers/authcontroller.js'
import csrfMiddleware from '../middlewares/csrf.js'
import authMiddleware from '../middlewares/authmiddleware.js'
const router = express.Router()


router.get('/github',passport.authenticate('github',{scope: ['user:email']}))

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure', session: false }),
  oAuthCallback
);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', logoutCont);

router.post('/logout-all', passport.authenticate('github', { session: false }), logoutAllCont);


router.get('/authorizedPage',authMiddleware,csrfMiddleware,checkedRes)
export default router
