import mongoose, { Document } from 'mongoose';
export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
    score: number;
    depth: number;
    isAiGenerated: boolean;
    aiSuggestions?: {
        grammarCheck?: string;
        betterPhrase?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, {}> & IComment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Comment.d.ts.map