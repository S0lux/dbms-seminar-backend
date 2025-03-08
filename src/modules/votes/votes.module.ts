import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VoteEntity } from './entities/vote.entity';

@Module({
  imports: [MikroOrmModule.forFeature([VoteEntity])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
