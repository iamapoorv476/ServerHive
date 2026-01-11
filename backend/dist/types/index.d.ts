import { Request } from 'express';
import { Document, Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    toSafeObject(): SafeUser;
}
export interface SafeUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IGig extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    budget: number;
    ownerId: Types.ObjectId | IUser;
    status: 'open' | 'assigned' | 'completed' | 'cancelled';
    hiredBidId: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBid extends Document {
    _id: Types.ObjectId;
    gigId: Types.ObjectId | IGig;
    freelancerId: Types.ObjectId | IUser;
    message: string;
    proposedPrice: number;
    status: 'pending' | 'hired' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface JWTPayload {
    id: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    count: number;
    total: number;
    totalPages: number;
    currentPage: number;
    data: T[];
}
export interface BidHiredEvent {
    bidId: string;
    gigId: string;
    gigTitle: string;
    message: string;
}
export interface GigQueryParams {
    search?: string;
    status?: 'open' | 'assigned' | 'completed' | 'cancelled';
    page?: string;
    limit?: string;
}
export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}
export interface LoginDTO {
    email: string;
    password: string;
}
export interface CreateGigDTO {
    title: string;
    description: string;
    budget: number;
}
export interface UpdateGigDTO {
    title?: string;
    description?: string;
    budget?: number;
}
export interface CreateBidDTO {
    gigId: string;
    message: string;
    proposedPrice: number;
}
export interface UpdateBidDTO {
    message?: string;
    proposedPrice?: number;
}
//# sourceMappingURL=index.d.ts.map