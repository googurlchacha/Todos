import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly logger: LoggerService,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    const saved = await this.todoRepository.save(todo);
    this.logger.log(`Todo created: id=${saved.id}`, 'TodoService');
    return saved;
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      this.logger.warn(`Todo not found: id=${id}`, 'TodoService');
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    const updated = await this.todoRepository.save(todo);
    this.logger.log(`Todo updated: id=${id}`, 'TodoService');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
    this.logger.log(`Todo deleted: id=${id}`, 'TodoService');
  }
}
