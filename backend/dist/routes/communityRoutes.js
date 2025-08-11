"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const communityController_1 = require("../controllers/communityController");
const router = express_1.default.Router();
// Community CRUD
router.post('/', auth_1.authenticateToken, communityController_1.createCommunity);
router.get('/', communityController_1.getCommunities);
router.get('/user', auth_1.authenticateToken, communityController_1.getUserCommunities);
router.get('/:name', communityController_1.getCommunity);
router.put('/:name', auth_1.authenticateToken, communityController_1.updateCommunity);
router.delete('/:name', auth_1.authenticateToken, communityController_1.deleteCommunity);
// Community membership
router.post('/:name/join', auth_1.authenticateToken, communityController_1.joinCommunity);
router.post('/:name/leave', auth_1.authenticateToken, communityController_1.leaveCommunity);
router.get('/:name/members', communityController_1.getCommunityMembers);
// Moderation
router.post('/:name/moderators', auth_1.authenticateToken, communityController_1.toggleModerator);
exports.default = router;
//# sourceMappingURL=communityRoutes.js.map