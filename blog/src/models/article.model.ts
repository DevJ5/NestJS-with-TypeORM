import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  description: string;

  @IsArray()
  tagList: string[];
}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  tagList: string[];
}

export interface FindFeedQuery {
  limit?: number;
  offset?: number;
}

export interface FindAllQuery extends FindFeedQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}
