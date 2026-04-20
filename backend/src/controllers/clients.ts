import { Request, Response, NextFunction } from 'express';
import { Client } from '../models/Client';
import { Project } from '../models/Project';
import { clientCreateSchema } from '../utils/validation';
import { paginate } from '../utils/paginate';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const result = await paginate(Client, query, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedData = clientCreateSchema.parse(req.body);
    const client = await Client.create({
      ...validatedData,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
};

export const getClientProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({ clientId: req.params.id });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const addCommunication = async (req: any, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    
    client.communications.push({
      ...req.body,
      userId: req.user._id
    });
    
    await client.save();
    res.json({ success: true, data: client.communications[client.communications.length - 1] });
  } catch (error) {
    next(error);
  }
};
