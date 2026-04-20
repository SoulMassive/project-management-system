import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { activityLogger } from './middleware/activityLogger';

// Import routes
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import clientRoutes from './routes/clients';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import notificationRoutes from './routes/notifications';
import fileRoutes from './routes/files';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Activity Logger (Mutations only)
app.use(activityLogger);

// Static folders
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes prefixed with /_/backend
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/clients', clientRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/', taskRoutes);
apiRouter.use('/', fileRoutes);
apiRouter.use('/notifications', notificationRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({ success: true, message: 'PMS API is healthy', timestamp: new Date() });
});

app.use('/_/backend/api', apiRouter);

// Error handling
app.use(errorHandler);

export default app;
