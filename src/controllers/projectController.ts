import { Request, Response, NextFunction } from 'express';
import { projectValidator } from '../config/inputValidators';
import {
  throwInputFieldsError,
  throwCustomError,
} from '../utils/throwCustomError';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatusOption, CustomErrorNames } from '../types/utilTypes';
import Project from '../models/projectSchema';

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { projectName } = req.body;
    const { error } = projectValidator({ projectName });
    if (error) {
      throwInputFieldsError(error.details.map((item) => item.message));
    }
    // check if user have project with same name
    const projectExists = await Project.findOne({ userId, projectName });
    if (projectExists) {
      throwInputFieldsError(['"projectName" already exists']);
    }
    //
    const project = await Project.create({ projectName, userId });
    if (project) {
      return res.status(StatusCodes.CREATED).json({
        status: ResponseStatusOption.success,
        message: 'project created successfully',
        project: { _id: project._id, projectName: project.projectName },
      });
    } else {
      throwCustomError(
        'could not create new user, please try again later',
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }
  } catch (error) {
    return next(error);
  }
};

const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const projects = await Project.find({ userId }).select('_id projectName');
    return res.status(StatusCodes.OK).json({
      status: ResponseStatusOption.success,
      message: 'current user projects',
      projects,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { projectId } = req.params;

    const projectExist = await Project.findOne({ _id: projectId, userId });

    if (projectExist === null) {
      throwCustomError(
        `no project with id ${projectId}`,
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }

    const deletedProject = await Project.deleteOne({ _id: projectId, userId });

    return res.status(StatusCodes.OK).json({
      status: ResponseStatusOption.success,
      message: 'project deleted',
      deletedProject,
    });
  } catch (error) {
    return next(error);
  }
};

const editProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const { projectId } = req.params;
    const { projectName } = req.body;
    const { error } = projectValidator({ projectName });
    if (error) {
      throwInputFieldsError(error.details.map((item) => item.message));
    }

    const projectExist = await Project.findOne({ _id: projectId, userId });

    if (projectExist === null) {
      throwCustomError(
        `no project with id ${projectId}`,
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }

    await Project.updateOne(
      { _id: projectId, userId },
      { projectName },
      { new: false },
    ).exec();

    return res.status(StatusCodes.OK).json({
      status: ResponseStatusOption.success,
      message: 'project edited',
    });
  } catch (error) {
    return next(error);
  }
};

export { createProject, getProjects, deleteProject, editProject };
