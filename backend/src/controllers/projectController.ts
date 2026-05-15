import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user?._id }, { teamMembers: req.user?._id }],
    }).populate('createdBy', 'name email').populate('teamMembers', 'name email');
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = new Project({
      title,
      description,
      createdBy: req.user?._id,
      teamMembers: teamMembers || [],
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.teamMembers = teamMembers || project.teamMembers;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
