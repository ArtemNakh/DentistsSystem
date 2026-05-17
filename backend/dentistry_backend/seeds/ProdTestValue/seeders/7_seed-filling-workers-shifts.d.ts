import { DataSource } from 'typeorm';
export declare function seedWorkerShifts(dataSource: DataSource, minShifts?: number, maxShifts?: number): Promise<void>;
