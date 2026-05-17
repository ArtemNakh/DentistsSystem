import { DataSource } from 'typeorm';
export declare function seedOperationList(dataSource: DataSource, minPerClinic?: number, maxPerClinic?: number, minCost?: number, maxCost?: number): Promise<void>;
