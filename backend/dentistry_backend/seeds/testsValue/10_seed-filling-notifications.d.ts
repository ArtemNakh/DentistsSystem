import { DataSource } from 'typeorm';
export declare function seedNotifications(dataSource: DataSource, minNotifications?: number, maxNotifications?: number): Promise<void>;
