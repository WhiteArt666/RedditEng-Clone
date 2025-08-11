import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const sendMessage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCommunityMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const editMessage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMessage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addReaction: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRecentMessages: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=communityMessageController.d.ts.map