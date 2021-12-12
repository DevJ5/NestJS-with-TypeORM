import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO } from 'src/models/comment.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
  ) {}

  findByArticleSlug(slug: string) {
    this.commentRepo.find({
      relations: ['article'],
      where: { 'article.slug': slug },
    });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = this.commentRepo.create(data);
    comment.author = user;
  }
}
