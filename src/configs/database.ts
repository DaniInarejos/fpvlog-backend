import mongoose from 'mongoose';
import { logger } from '../utils/logger';

interface DatabaseConfig {
  readonly maxRetries: number;
  readonly retryInterval: number;
  readonly maxPoolSize: number;
  readonly maxIdleTimeMS: number;
  readonly serverSelectionTimeoutMS: number;
  readonly socketTimeoutMS: number;
}

class DatabaseError extends Error {
  constructor(message: string, public readonly code?: number) {
    super(message);
    this.name = 'DatabaseError';
  }
}

const DB_CONFIG: DatabaseConfig = {
  maxRetries: 3,
  retryInterval: 5000,
  maxPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 20000,
} as const;

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionPromise: Promise<typeof mongoose> | null = null;
  private isShuttingDown = false;

  private constructor() {
    this.setupGracefulShutdown();
    this.attachConnectionListeners();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private formatError(error: any): string {
    if (error?.code === 8000) return 'Credenciales inválidas';
    if (error?.code === 'ENOTFOUND') return 'Host no encontrado';
    if (error?.code === 'ECONNREFUSED') return 'Conexión rechazada';
    return error?.message || 'Error desconocido';
  }

  private attachConnectionListeners(): void {
    mongoose.connection.on('disconnected', () => {
      if (!this.isShuttingDown) {
        logger.warn('MongoDB desconectado inesperadamente');
        this.connectionPromise = null;
      }
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Error MongoDB:', this.formatError(error));
    });
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.isShuttingDown = true;
      try {
        await this.forceDisconnect();
        logger.info(`MongoDB cerrado por ${signal}`);
      } catch (error) {
        logger.error('Error en cierre:', this.formatError(error));
      }
      process.exit(0);
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  }

  private getConnectionOptions(): mongoose.ConnectOptions {
    return {
      maxPoolSize: DB_CONFIG.maxPoolSize,
      maxIdleTimeMS: DB_CONFIG.maxIdleTimeMS,
      serverSelectionTimeoutMS: DB_CONFIG.serverSelectionTimeoutMS,
      socketTimeoutMS: DB_CONFIG.socketTimeoutMS,
      bufferCommands: false,
    };
  }

  public async connect(retryCount = 0): Promise<void> {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new DatabaseError('MONGO_URI no definida');
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (mongoose.connection.readyState === 2 && this.connectionPromise) {
      await this.connectionPromise;
      return;
    }

    try {
      this.connectionPromise = mongoose.connect(mongoUri, this.getConnectionOptions());
      await this.connectionPromise;
      logger.info('MongoDB conectado');
    } catch (error) {
      await this.cleanupConnection();
      
      if (retryCount < DB_CONFIG.maxRetries) {
        logger.warn(`Reintento ${retryCount + 1}/${DB_CONFIG.maxRetries}`);
        await this.delay(DB_CONFIG.retryInterval);
        return this.connect(retryCount + 1);
      }
      
      throw new DatabaseError(`Conexión falló: ${this.formatError(error)}`);
    }
  }

  private async cleanupConnection(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch {
      // Ignorar errores de limpieza
    } finally {
      this.connectionPromise = null;
    }
  }

  public async forceDisconnect(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close(true);
      }
      this.connectionPromise = null;
    } catch (error) {
      throw new DatabaseError(`Error desconectando: ${this.formatError(error)}`);
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected()) return false;
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      } else {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const dbConnection = DatabaseConnection.getInstance();

export const connectToDatabase = (): Promise<void> => dbConnection.connect();
export const disconnectFromDatabase = (): Promise<void> => dbConnection.forceDisconnect();
export const isDatabaseConnected = (): boolean => dbConnection.isConnected();
export const databaseHealthCheck = (): Promise<boolean> => dbConnection.healthCheck();

export default connectToDatabase;
export { DatabaseError };
