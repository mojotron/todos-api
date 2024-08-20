import mongoose from 'mongoose';

type TaskAssignmentType = {
  text: string;
  list: string[];
  checkbox: { checked: boolean; value: string }[];
};

const taskAssignmentSchema = new mongoose.Schema<TaskAssignmentType>(
  {
    text: {
      type: String,
      required: true,
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
  { timestamps: true },
);

const TaskAssignment = mongoose.model<TaskAssignmentType>(
  'TextTask',
  taskAssignmentSchema,
);

export default TaskAssignment;
