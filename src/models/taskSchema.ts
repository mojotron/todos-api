import mongoose from 'mongoose';

type TaskDescription = {
  checked: boolean;
  text: string;
};

type TaskType = {
  title: string;
  deadline: null | Date;
  priority: 'low' | 'high' | 'critical';
  category: 'text' | 'list' | 'checkbox';
  description: TaskDescription[];
  projectId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
};

const taskSchema = new mongoose.Schema<TaskType>(
  {
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
      default: 'text',
      required: true,
    },
    description: {
      type: [{ checked: { type: Boolean }, text: { type: String } }],
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model<TaskType>('Task', taskSchema);

export default Task;
