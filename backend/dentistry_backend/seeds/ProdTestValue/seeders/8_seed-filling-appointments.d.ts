import { DataSource } from 'typeorm';
export declare function seedAppointments(dataSource: DataSource, minAppointmentsPerClient?: number, maxAppointmentsPerClient?: number, minOperationsPerDoctor?: number, maxOperationsPerDoctor?: number): Promise<void>;
