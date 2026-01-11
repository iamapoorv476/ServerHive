"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Make sure token exists
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
            return;
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Get user from token
            const user = await User_1.default.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in authentication',
        });
    }
};
exports.protect = protect;
// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, _res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = await User_1.default.findById(decoded.id).select('-password');
                req.user = user || undefined;
            }
            catch (error) {
                // Token invalid but continue anyway
                req.user = undefined;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map