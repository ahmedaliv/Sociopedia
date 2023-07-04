import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from '../controllers/usersController.js'

import { verifyToken } from '../middlewares/authMiddlewares.js';



const router = express.Router();

/* READ */
// this for the single user
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);


/* UPDATE */
router.put('/:id/friends', verifyToken, addRemoveFriend);


export default router;