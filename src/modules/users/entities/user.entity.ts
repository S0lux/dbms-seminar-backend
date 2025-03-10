import {
  BeforeCreate,
  Collection,
  Entity,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { PostEntity } from '../../posts/entities/post.entity';
import { VoteEntity } from '../../votes/entities/vote.entity';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string & Opt = uuidv4();

  @Property({ name: 'email', unique: true })
  @IsEmail()
  email!: string;

  @Property({ name: 'display_name' })
  displayName!: string;

  @Property({ name: 'hashed_password', hidden: true })
  hashedPassword!: string;

  @Property({ name: 'profile_image' })
  profileImage?: string & Opt;

  @OneToMany({
    entity: () => VoteEntity,
    mappedBy: 'user',
  })
  votes = new Collection<VoteEntity>(this);

  @OneToMany({
    mappedBy: (post: PostEntity) => post.author,
    orphanRemoval: true,
  })
  posts = new Collection<PostEntity>(this);

  @BeforeCreate()
  setDefaultProfileImage() {
    if (!this.profileImage) {
      this.profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${this.displayName}`;
    }
  }
}
