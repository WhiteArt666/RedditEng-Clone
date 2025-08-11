import mongoose, { Document } from 'mongoose';
export interface ICommunityMessage extends Document {
    community: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    type: 'text' | 'image' | 'audio';
    attachments?: {
        type: 'image' | 'audio';
        url: string;
        publicId: string;
    }[];
    isEdited: boolean;
    editedAt?: Date;
    reactions: {
        user: mongoose.Types.ObjectId;
        emoji: string;
    }[];
    replyTo?: mongoose.Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICommunityMessage, {}, {}, {}, mongoose.Document<unknown, {}, ICommunityMessage, {}, {}> & ICommunityMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=CommunityMessage.d.ts.map