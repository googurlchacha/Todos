import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('todos')
export class Todo {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Buy groceries' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ example: false })
  @Column({ default: false })
  completed: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
