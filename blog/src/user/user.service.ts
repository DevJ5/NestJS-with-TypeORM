import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(@User() username: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { username } });
  }

  async updateUser(username: string, data: UpdateUserDto): Promise<UserEntity> {
    await this.userRepo.update({ username }, data);
    return this.findByUsername(username);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers = user.followers.filter(
      (follower) => follower.id !== currentUser.id,
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
