import { Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    
    // Find projects user has access to
    const projects = await Project.find({
      $or: [{ createdBy: req.user?._id }, { teamMembers: req.user?._id }],
    });
    
    const projectIds = projects.map(p => p._id);

    let query: any = { projectId: { $in: projectIds } };
    if (projectId) {
      if (!projectIds.some(id => id.toString() === projectId)) {
         res.status(403);
         throw new Error('Not authorized to access tasks for this project');
      }
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .populate('createdBy', 'name');
      
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user?._id,
    });
    
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = req.body.title || task.title;
      task.description = req.body.description !== undefined ? req.body.description : task.description;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
      task.status = req.body.status || task.status;
      task.priority = req.body.priority || task.priority;
      task.dueDate = req.body.dueDate || task.dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const getTaskStats = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user?._id }, { teamMembers: req.user?._id }],
    });
    
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } });

    const stats = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      pendingTasks: tasks.filter(t => t.status === 'Pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
      overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
      taskCompletionRate: tasks.length ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0,
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
