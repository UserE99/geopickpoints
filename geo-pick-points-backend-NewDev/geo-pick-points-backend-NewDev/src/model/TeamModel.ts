import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITeam extends Document {
    name: string;
    codeInvite: string;
    qaCode:string;
    shareUrl:string;
    poiId:Types.ObjectId[];
    poiPoints: number[];
    players: Types.ObjectId[]; 
}

const teamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    codeInvite: { type: String, required: true },
    qaCode: { type: String, required: true },
    shareUrl: { type: String, required: true },
    poiId: [{ type: Schema.Types.ObjectId, ref: 'PositionClaimed' }],
    poiPoints: [{type: Number}],
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], 
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);
