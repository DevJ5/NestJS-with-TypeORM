import { IsString } from 'class-validator';

import { UserEntity } from 'src/entities/user.entity';
import { ProfileResponse } from './user.model';

export class CreateCommentDTO {
  @IsString()
  body: string;
}

export class CreateCommentBody {
  comment: CreateCommentDTO;
}

export class CommentResponse {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  body: string;
  author: ProfileResponse | UserEntity;
}
