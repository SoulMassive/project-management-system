import { Response, NextFunction } from 'express';
import { AuthRequest } from './protect';
import { ActivityLog } from '../models/ActivityLog';

export const activityLogger = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  // We log after the request is successful
  res.send = function (body) {
    res.send = originalSend;
    const responseBody = typeof body === 'string' ? JSON.parse(body) : body;

    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      const { method, url, body: requestBody, params } = req;
      
      // Determine action and entity based on method and URL
      let action = '';
      let entityType: any = null;
      let entityId = null;

      if (method === 'POST') action = 'Created';
      else if (method === 'PATCH' || method === 'PUT') action = 'Updated';
      else if (method === 'DELETE') action = 'Deleted';

      if (url.includes('/users')) entityType = 'User';
      else if (url.includes('/clients')) entityType = 'Client';
      else if (url.includes('/projects')) entityType = 'Project';
      else if (url.includes('/tasks')) entityType = 'Task';
      else if (url.includes('/files')) entityType = 'File';

      // Try to get entityId from params or response body
      entityId = params.id || responseBody?.data?._id || null;

      if (action && entityType) {
        ActivityLog.create({
          userId: req.user._id,
          action: `${action} ${entityType}`,
          entityType,
          entityId: mongoose.Types.ObjectId.isValid(entityId) ? entityId : null,
          metadata: {
            method,
            url,
            requestBody: method !== 'DELETE' ? requestBody : undefined
          }
        }).catch(err => console.error('Activity log error:', err));
      }
    }
    return originalSend.call(this, body);
  };

  next();
};

import mongoose from 'mongoose';
