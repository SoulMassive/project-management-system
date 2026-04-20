import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { projectCreateSchema } from '../utils/validation';
import { paginate } from '../utils/paginate';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, stage, type, clientId, search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const query: any = {};
    if (status) query.status = status;
    if (stage) query.stage = stage;
    if (type) query.type = type;
    if (clientId) query.clientId = clientId;
    if (search) query.name = { $regex: search, $options: 'i' };

    const result = await paginate(Project.find(query).populate('clientId', 'name company'), query, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedData = projectCreateSchema.parse(req.body);
    const project = await Project.create({
      ...validatedData,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name company email')
      .populate('teamMembers', 'name email role avatarUrl');
    
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project and associated tasks/files deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage } = req.body;
    const stages = ['Lead', 'Proposal', 'Development', 'Testing', 'Live', 'Maintenance'];
    
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    // Validate stage transition order (allow moving forward or same)
    const currentIndex = stages.indexOf(project.stage);
    const newIndex = stages.indexOf(stage);
    
    if (newIndex < currentIndex) {
      return res.status(400).json({ success: false, error: 'Cannot downgrade project stage' });
    }

    project.stage = stage;
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const manageTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, action } = req.body; // action: 'add' | 'remove'
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    if (action === 'add') {
      if (!project.teamMembers.includes(userId)) {
        project.teamMembers.push(userId);
      }
    } else {
      project.teamMembers = project.teamMembers.filter(id => id.toString() !== userId);
    }

    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    project.notes.push({
      userId: req.user._id,
      content: req.body.content
    } as any);

    await project.save();
    res.json({ success: true, data: project.notes[project.notes.length - 1] });
  } catch (error) {
    next(error);
  }
};
