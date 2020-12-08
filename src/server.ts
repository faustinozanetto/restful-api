import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

// import routes
import indexRoutes from './routes/indexRoutes';
import PostsRoutes from './routes/PostRoutes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    // Mongoose
    const MONGO_URI = 'mongodb://localhost/restapi';
    mongoose.set('useFindAndModify', true);
    mongoose
      .connect(MONGO_URI || process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then((db) => console.log('Database connected!'));

    // Settings
    this.app.set('port', process.env.PORT || 3000);
    // Middleawares
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
  }

  public routes(): void {
    this.app.use('/', indexRoutes);
    this.app.use('/api', PostsRoutes);
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server listening on port', this.app.get('port'));
    });
  }
}

export { Server };
