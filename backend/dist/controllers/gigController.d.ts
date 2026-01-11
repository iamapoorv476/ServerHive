import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getGigs: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getGig: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createGig: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateGig: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteGig: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyGigs: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=gigController.d.ts.map