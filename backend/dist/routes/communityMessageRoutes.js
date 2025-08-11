"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const communityMessageController_1 = require("../controllers/communityMessageController");
const router = express_1.default.Router();
// Message routes
router.post('/:communityName/messages', auth_1.authenticateToken, communityMessageController_1.sendMessage);
router.get('/:communityName/messages', communityMessageController_1.getCommunityMessages);
router.put('/messages/:messageId', auth_1.authenticateToken, communityMessageController_1.editMessage);
router.delete('/messages/:messageId', auth_1.authenticateToken, communityMessageController_1.deleteMessage);
router.post('/messages/:messageId/reactions', auth_1.authenticateToken, communityMessageController_1.addReaction);
// Get recent messages for user's communities
router.get('/messages/recent', auth_1.authenticateToken, communityMessageController_1.getRecentMessages);
exports.default = router;
//# sourceMappingURL=communityMessageRoutes.js.map