import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICredential extends Document {
  title: string;
  username: string;
  password?: string;
  url?: string;
  notes?: string;
  project?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const credentialSchema = new Schema(
  {
    title: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    url: { type: String },
    notes: { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Credential: Model<ICredential> = mongoose.model<ICredential>('Credential', credentialSchema);
export default Credential;
