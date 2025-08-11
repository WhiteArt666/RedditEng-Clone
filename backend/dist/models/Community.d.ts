import mongoose, { Document } from 'mongoose';
export interface ICommunity extends Document {
    name: string;
    displayName: string;
    description: string;
    avatar?: string;
    banner?: string;
    category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General';
    creator: mongoose.Types.ObjectId;
    moderators: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
    memberCount: number;
    postCount: number;
    isPrivate: boolean;
    rules: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICommunity, {}, {}, {}, mongoose.Document<unknown, {}, ICommunity, {}, {}> & ICommunity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Community.d.ts.map