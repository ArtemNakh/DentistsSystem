import { ApiProperty } from '@nestjs/swagger';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

//field for creating new value
interface DentistryCreateAttr {
  street: string;
  city: string;
  region: string;
}

//Dentistries
@Table({ tableName: 'dental_clinics' })
export class Dentistry extends Model<Dentistry, DentistryCreateAttr> {
//   @ApiProperty({ example: '1', description: 'Primary key' })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

//   @ApiProperty({
//     example: 'Rubana:2',
//     description: 'Name street and building number',
//   })
  @Column({ type: DataType.STRING, allowNull: false })
  street: string;

//   @ApiProperty({ example: 'Zaporizhzhia', description: 'City name ' })
  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

//   @ApiProperty({
//     example: 'Zaporizhia',
//     description: 'Region where the building is located',
//   })
  @Column({ type: DataType.STRING, allowNull: false })
  region: string;

//   @ApiProperty({
//     description: 'Date and time of creation of the record',
//     example: '2025-12-17T12:40:00.000Z',
//   })
  @CreatedAt
  declare create_at: Date;

//   @ApiProperty({
//     description: 'Date and time the record were updated',
//     example: '2025-12-17T12:45:00.000Z',
//   })
  @UpdatedAt
  declare updated_at: Date;
}
