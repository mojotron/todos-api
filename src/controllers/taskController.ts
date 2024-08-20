import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
import TextTask from '../models/textTaskSchema';
import Task from '../models/taskSchema';
import { throwCustomError } from '../utils/throwCustomError';
import { Mongoose } from 'mongoose';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const {
      title,
      deadline,
      category,
      priority,
      projectId,
      assignment: { text },
    } = req.body;

    // create assignment
    if (category === 'text') {
      const textDoc = await TextTask.create({ assignment: text });
      if (textDoc === null) {
        throwCustomError(
          'no assignment doc created',
          400,
          CustomErrorNames.badRequest,
        );
      }
    }

    const task = await Task.create({
      title,
      deadline: new Date(deadline),
      category,
      priority,
      projectId,
      assignmentId: userId,
    });

    if (!task) {
      throwCustomError('no task doc created', 400, CustomErrorNames.badRequest);
    }

    return res.status(StatusCodes.CREATED).json({
      status: ResponseStatusOption.success,
      message: 'task created',
      //task,
      task,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { createTask };
