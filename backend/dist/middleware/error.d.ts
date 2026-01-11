import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    errors?: any;
}
export declare const errorHandler: (err: CustomError, _req: Request, res: Response, _next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=error.d.ts.map