import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests, rejectFriendRequest, cancelFriendRequest} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute); // apply this middleware to all routes

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/accept/:id', acceptFriendRequest);
router.put('/friend-request/reject/:id', rejectFriendRequest);
router.delete('/friend-request/cancel/:id', cancelFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);

export default router;