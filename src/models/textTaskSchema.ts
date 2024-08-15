import mongoose from 'mongoose';

type TextTaskType = {
  assignment: string;
};

const textTaskSchema = new mongoose.Schema<TextTaskType>(
  {
    assignment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const TextTask = mongoose.model<TextTaskType>('TextTask', textTaskSchema);

export default TextTask;
