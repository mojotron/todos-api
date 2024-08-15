import mongoose from 'mongoose';

type TaskType = {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  deadline: null | Date;
  priority: 'low' | 'high' | 'critical';
  category: 'text' | 'list' | 'checkbox';
  assignmentId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
};

const taskSchema = new mongoose.Schema<TaskType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, unique: true },
    deadline: { type: Date, required: true, unique: true },
    priority: {
      type: String,
      enum: { values: ['low', 'high', 'critical'] },
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: {
        values: ['text', 'list', 'checkbox'],
      },
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model<TaskType>('Task', taskSchema);

export default Task;
