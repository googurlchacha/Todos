import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { LoggerService } from '../logger/logger.service';

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test todo',
    description: 'Test description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...mockTodo, ...dto })),
    save: jest.fn().mockResolvedValue(mockTodo),
    find: jest.fn().mockResolvedValue([mockTodo]),
    findOne: jest.fn().mockResolvedValue(mockTodo),
    remove: jest.fn().mockResolvedValue(mockTodo),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(Todo), useValue: mockRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const dto: CreateTodoDto = { title: 'New todo', description: 'Desc' };
      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateDto = { title: 'Updated', completed: true };
      const updated = { ...mockTodo, ...updateDto };
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result.title).toBe('Updated');
      expect(result.completed).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      await service.remove(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTodo);
    });
  });
});
