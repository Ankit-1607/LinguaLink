import express from 'express'
import {
  signup, 
  login,
  logout,
  bio,
  me
  } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/bio", protectRoute, bio);
router.get("/me", protectRoute, me); // check if user is signed in/logged in

export default router;