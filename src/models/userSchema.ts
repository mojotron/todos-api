import { compare, genSalt, hash } from 'bcryptjs';
import mongoose from 'mongoose';

type UserType = {
  username: string;
  email: string;
  password: string;
  validatePassword: (enteredPassword: string) => Promise<boolean>;
};

const userSchema = new mongoose.Schema<UserType>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

userSchema.methods.validatePassword = async function (enteredPassword: string) {
  return await compare(enteredPassword, this.password);
};

const User = mongoose.model<UserType>('User', userSchema);

export default User;
