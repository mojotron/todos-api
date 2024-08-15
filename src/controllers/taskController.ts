import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
import TextTask from '../models/textTaskSchema';
import Task from '../models/taskSchema';
import { throwCustomError } from '../utils/throwCustomError';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { title, deadline, category, priority, projectId, assignment } =
      req.body;
    console.log('1');

    // create assignment
    let assignmentDoc = null;
    if (category === 'text') {
      console.log('2');
      assignmentDoc = await TextTask.create({ assignment });
    }

    console.log(assignmentDoc);

    if (assignmentDoc === null) {
      throwCustomError(
        'no assignment doc created',
        400,
        CustomErrorNames.badRequest,
      );
    }

    const task = await Task.create({
      title,
      deadline,
      category,
      priority,
      projectId,
      assignmentId: assignmentDoc?._id,
      userId,
    });

    if (!task) {
      throwCustomError('no task doc created', 400, CustomErrorNames.badRequest);
    }

    return res.status(StatusCodes.CREATED).json({
      status: ResponseStatusOption.success,
      message: 'task created',
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export { createTask };
