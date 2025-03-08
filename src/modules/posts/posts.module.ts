import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { VoteEntity } from '../votes/entities/vote.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity, UserEntity, VoteEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
