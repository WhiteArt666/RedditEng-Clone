import mongoose, { Document } from 'mongoose';
export interface IPost extends Document {
    title: string;
    content: string;
    type: 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question';
    category: 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General' | 'ShortVideo';
    author: mongoose.Types.ObjectId;
    community?: mongoose.Types.ObjectId;
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
    score: number;
    commentCount: number;
    tags: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isAiGenerated: boolean;
    aiSuggestions?: {
        grammarCheck?: string;
        betterPhrase?: string;
        pronunciation?: string;
    };
    attachments?: {
        type: 'image' | 'audio';
        url: string;
        publicId: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Post.d.ts.map