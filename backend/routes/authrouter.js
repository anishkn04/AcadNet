import express from 'express'
import passport from 'passport'
import { oAuthCallback } from '../controllers/authcontroller.js'
const router = express.Router()

// Placeholder for authentication-related endpoints

router.get('/github',passport.authenticate('github',{scope: ['user:email']}))

router.get('/github/callback',passport.authenticate('github',{failureRedirect: '/failure',session: false},oAuthCallback)
)

export default router
