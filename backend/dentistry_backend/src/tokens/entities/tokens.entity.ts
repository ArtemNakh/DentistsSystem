import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IToken, TokenType } from './tokens.interface';

@Entity({ name: 'tokens' })
export class Token implements IToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  token: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ name: 'expires_in', type: 'timestamp' })
  expiresIn: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
