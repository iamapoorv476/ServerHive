import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const createBid: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getBidsForGig: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyBids: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const hireBid: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBid: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBid: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=bidController.d.ts.map