"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bidController_1 = require("../controllers/bidController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, bidController_1.createBid);
router.get('/my/submitted', auth_1.protect, bidController_1.getMyBids);
router.get('/:gigId', auth_1.protect, bidController_1.getBidsForGig);
router.patch('/:bidId/hire', auth_1.protect, bidController_1.hireBid);
router.put('/:bidId', auth_1.protect, bidController_1.updateBid);
router.delete('/:bidId', auth_1.protect, bidController_1.deleteBid);
exports.default = router;
//# sourceMappingURL=bids.js.map