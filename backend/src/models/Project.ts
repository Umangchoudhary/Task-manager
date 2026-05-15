import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
}

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
export default Project;
