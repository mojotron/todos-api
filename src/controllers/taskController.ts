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
    return next(error);
  }
};

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;

    const tasks = await Task.find({ userId });

    return res.status(StatusCodes.OK).json({
      status: ResponseStatusOption.success,
      messages: 'get all user tasks',
      tasks,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { taskId } = req.params;
    const deletedTask = await Task.deleteOne({ userId, _id: taskId });
    return res.status(StatusCodes.ACCEPTED).json({
      status: ResponseStatusOption.success,
      message: 'task deleted',
      deletedTask,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

const editTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export { createTask, getTasks, deleteTask, editTask };
