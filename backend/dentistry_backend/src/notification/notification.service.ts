import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotification } from './entity/notification.interface';
import { Notification } from './entity/notification.entity';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  findAll(): Promise<INotification[]> {
    return this.notificationRepo.find({ relations: ['appointment'] });
  }
}
