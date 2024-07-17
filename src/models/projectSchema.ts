import mongoose from 'mongoose';

type ProjectType = {
  name: string;
};

const projectSchema = new mongoose.Schema<ProjectType>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

const Project = mongoose.model<ProjectType>('Project', projectSchema);

export default Project;
