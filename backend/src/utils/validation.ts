import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Manager', 'Developer', 'Sales']),
});

export const clientCreateSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number').optional(),
});

export const projectCreateSchema = z.object({
  name: z.string().min(2),
  clientId: z.string().regex(/^[0-9a-fA-D]{24}$/, 'Invalid Client ID'),
  type: z.enum(['Website', 'App', 'Ecommerce', 'Branding', 'SEO', 'Other']),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
});

export const taskCreateSchema = z.object({
  title: z.string().min(2),
  projectId: z.string().regex(/^[0-9a-fA-D]{24}$/, 'Invalid Project ID'),
  assignedTo: z.array(z.string().regex(/^[0-9a-fA-D]{24}$/)).optional(),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']).default('Medium'),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});
