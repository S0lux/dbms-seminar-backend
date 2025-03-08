import {
  BeforeCreate,
  Entity,
  Enum,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

@Entity({ tableName: 'votes' })
@Unique({ properties: ['user', 'post'] })
export class VoteEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string & Opt = uuidv4();

  @Enum(() => VoteType)
  type!: VoteType;

  @ManyToOne(() => UserEntity)
  user: Ref<UserEntity>;

  @ManyToOne(() => PostEntity)
  post: Ref<PostEntity>;

  @Property({ type: 'datetime' })
  createdAt?: Date & Opt;

  @Property({ type: 'datetime', nullable: true })
  updatedAt?: Date & Opt;

  @BeforeCreate()
  setDefaults() {
    this.createdAt = new Date();
  }
}
