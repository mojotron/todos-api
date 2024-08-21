import mongoose from 'mongoose';

type TaskAssignmentType = {
  text: string;
  list: string[];
  checkbox: { checked: boolean; value: string }[];
};

type TaskType = {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  deadline: null | Date;
  priority: 'low' | 'high' | 'critical';
  category: 'text' | 'list' | 'checkbox';
  assignment: TaskAssignmentType;
  projectId: mongoose.Schema.Types.ObjectId;
};

const taskSchema = new mongoose.Schema<TaskType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    deadline: { type: Date, required: false },
    priority: {
      type: String,
      enum: { values: ['low', 'high', 'critical'] },
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ['text', 'list', 'checkbox'],
      },
      required: true,
    },
    assignment: {
      text: {
        type: String,
        required: true,
        default: '',
      },
      list: {
        type: [String],
        required: true,
      },
      checkbox: {
        type: [{ checked: { type: Boolean }, value: { type: String } }],
        required: true,
      },
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
