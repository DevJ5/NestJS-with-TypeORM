import * as bcrypt from 'bcryptjs';
import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { ArticleEntity } from './article.entity';

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

  @ManyToMany((type) => UserEntity, (user) => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: {
      name: 'followee',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'follower',
      referencedColumnName: 'id',
    },
  })
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  following: UserEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ManyToMany((type) => ArticleEntity, (article) => article.favoritedBy)
  favorites: ArticleEntity[];

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

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);
    const profile = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
