import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createCommunity: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCommunities: (req: Request, res: Response) => Promise<void>;
export declare const getCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCommunity: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCommunity: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const joinCommunity: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const leaveCommunity: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCommunityMembers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserCommunities: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleModerator: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=communityController.d.ts.map