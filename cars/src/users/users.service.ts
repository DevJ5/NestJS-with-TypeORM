import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // Create before save, because the entity might run logic such as hooks or validation,
    // which would not run if we only use save.
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null; // Since undefined bug returns the first row
    // Returns the first instance or null
    return this.repo.findOne(id);
    // Where clause: return this.repo.findOne({email: 'asdf@asdf.com'});
  }

  find(email: string) {
    // Returns an array
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.save({ ...user, ...attrs });
    // Object.assign(user, attrs);
    // return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  }
}

// update, insert and delete methods on the repository do NOT run hooks.
