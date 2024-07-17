import mongoose from 'mongoose';

type TaskType = {
  name: string;
  deadline: null | Date;
  priority: 'low' | 'moderate' | 'critical';
  category: 'text' | 'list' | 'checkbox';
  assignments: string[];
};

const taskSchema = new mongoose.Schema<TaskType>(
  {
    name: { type: String, required: true, unique: true },
    deadline: { type: String, required: true, unique: true },
    priority: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    assignments: { type: [String], required: true },
  },
  { timestamps: true },
);

const Task = mongoose.model<TaskType>('Task', taskSchema);

export default Task;
