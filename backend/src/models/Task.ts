import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  createdBy: mongoose.Types.ObjectId;
}

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;
