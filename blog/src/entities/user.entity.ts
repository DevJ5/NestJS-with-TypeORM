import * as bcrypt from 'bcryptjs';
import { Exclude, instanceToPlain } from 'class-transformer';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract-entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return instanceToPlain(this);
  }

  // TODO: add following
}
