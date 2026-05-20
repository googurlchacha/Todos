import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries', minLength: 1, maxLength: 500 })
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(500)
  title: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
