import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
// schema
import Task from '../models/taskSchema';
import { throwCustomError } from '../utils/throwCustomError';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { title, deadline, category, priority, projectId, assignment } =
      req.body;
    console.log(
      'hello there',
      title,
      deadline,
      category,
      priority,
      projectId,
      assignment,
    );

    const task = await Task.create({
      userId,
      title,
      deadline: deadline ? new Date(deadline) : null,
      category,
      priority,
      projectId,
      assignment: { ...assignment },
    });

    if (!task) {
      throwCustomError('no task doc created', 400, CustomErrorNames.badRequest);
    } else {
      return res.status(StatusCodes.CREATED).json({
        status: ResponseStatusOption.success,
        message: 'task created',
        //task,
        task,
      });
    }
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { createTask };
