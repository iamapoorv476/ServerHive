"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = require("./middleware/error");
dotenv_1.default.config();
(0, db_1.default)();
const auth_1 = __importDefault(require("./routes/auth"));
const gigs_1 = __importDefault(require("./routes/gigs"));
const bids_1 = __importDefault(require("./routes/bids"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});
app.set('io', io);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join-user-room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/gigs', gigs_1.default);
app.use('/api/bids', bids_1.default);
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
app.use(error_1.notFound);
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Socket.io ready for real-time notifications`);
});
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    httpServer.close(() => process.exit(1));
});
exports.default = app;
//# sourceMappingURL=server.js.map