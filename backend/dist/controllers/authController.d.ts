import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const register: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map