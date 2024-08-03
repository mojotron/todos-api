import mongoose from 'mongoose';

type ProjectType = {
  projectName: string;
  userId: mongoose.Schema.Types.ObjectId;
};

const projectSchema = new mongoose.Schema<ProjectType>(
  {
    projectName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Project = mongoose.model<ProjectType>('Project', projectSchema);

export default Project;
