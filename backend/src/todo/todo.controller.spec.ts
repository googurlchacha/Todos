import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';

const mockTodo: Todo = {
  id: 1,
  title: 'Test',
  description: null,
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTodoService = {
  create: jest.fn().mockResolvedValue(mockTodo),
  findAll: jest.fn().mockResolvedValue([mockTodo]),
  findOne: jest.fn().mockResolvedValue(mockTodo),
  update: jest.fn().mockResolvedValue({ ...mockTodo, completed: true }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    const dto: CreateTodoDto = { title: 'New' };
    expect(await controller.create(dto)).toEqual(mockTodo);
    expect(mockTodoService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should return todos', async () => {
    expect(await controller.findAll()).toEqual([mockTodo]);
    expect(mockTodoService.findAll).toHaveBeenCalled();
  });

  it('findOne should return one todo', async () => {
    expect(await controller.findOne(1)).toEqual(mockTodo);
    expect(mockTodoService.findOne).toHaveBeenCalledWith(1);
  });

  it('update should call service.update', async () => {
    expect(await controller.update(1, { completed: true })).toEqual({
      ...mockTodo,
      completed: true,
    });
    expect(mockTodoService.update).toHaveBeenCalledWith(1, { completed: true });
  });

  it('remove should call service.remove', async () => {
    await controller.remove(1);
    expect(mockTodoService.remove).toHaveBeenCalledWith(1);
  });
});
