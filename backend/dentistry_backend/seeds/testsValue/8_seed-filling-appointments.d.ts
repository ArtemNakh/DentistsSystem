import { DataSource } from 'typeorm';
export declare function seedAppointments(dataSource: DataSource, minAppointments?: number, maxAppointments?: number): Promise<void>;
