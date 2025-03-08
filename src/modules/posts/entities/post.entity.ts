import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  Formula,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  Ref,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../users/entities/user.entity';
import { VoteEntity, VoteType } from '../../votes/entities/vote.entity';

@Entity({ tableName: 'posts' })
export class PostEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string & Opt = uuidv4();

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @Property({ type: 'datetime' })
  postedAt?: Date & Opt;

  @Property({ type: 'datetime', nullable: true })
  editedAt?: Date & Opt;

  @ManyToOne(() => UserEntity)
  author: Ref<UserEntity>;

  @OneToMany({
    entity: () => VoteEntity,
    mappedBy: (vote) => vote.post,
  })
  votes = new Collection<VoteEntity>(this);

  @Formula(
    (alias) => `(
      SELECT COALESCE(SUM(CASE WHEN v.type = '${VoteType.UPVOTE}' THEN 1 WHEN v.type = '${VoteType.DOWNVOTE}' THEN -1 ELSE 0 END), 0) 
      FROM votes v 
      WHERE v.post_id = ${alias}.id
    )`,
  )
  voteScore!: number;

  @Formula(
    (alias) => `(
      SELECT COUNT(*) 
      FROM votes v 
      WHERE v.post_id = ${alias}.id AND v.type = '${VoteType.UPVOTE}'
    )`,
  )
  upvoteCount!: number;

  @Formula(
    (alias) => `(
      SELECT COUNT(*) 
      FROM votes v 
      WHERE v.post_id = ${alias}.id AND v.type = '${VoteType.DOWNVOTE}'
    )`,
  )
  downvoteCount!: number;

  @BeforeCreate()
  setDefaults() {
    this.postedAt = new Date();
  }

  @BeforeUpdate()
  setEdited() {
    this.editedAt = new Date();
  }
}
