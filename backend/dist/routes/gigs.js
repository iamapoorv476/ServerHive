"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gigController_1 = require("../controllers/gigController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(auth_1.optionalAuth, gigController_1.getGigs).post(auth_1.protect, gigController_1.createGig);
router.get('/my/posted', auth_1.protect, gigController_1.getMyGigs);
router.route('/:id').get(auth_1.optionalAuth, gigController_1.getGig).put(auth_1.protect, gigController_1.updateGig).delete(auth_1.protect, gigController_1.deleteGig);
exports.default = router;
//# sourceMappingURL=gigs.js.map