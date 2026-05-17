import { DataSource } from 'typeorm';
export declare function seedWorkers(dataSource: DataSource, minWorkers?: number, maxWorkers?: number): Promise<void>;
