import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PostEntity } from './entities/post.entity';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreatePostRequestDto } from './dtos/create-post-request.dto';
import { UserEntity } from '../users/entities/user.entity';
import { err, ok, Result } from 'neverthrow';
import { PostError } from './errors/base-post.error';
import { VoteEntity, VoteType } from '../votes/entities/vote.entity';
import { VoteError } from '../votes/errors/base-vote.error';
import { PostNotVotedError } from './errors/post-not-voted-error';
import { UpdatePostRequestDto } from './dtos/update-post-request.dto';
import { QueryPostRequestDto } from './dtos/query-post-request.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: EntityRepository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: EntityRepository<UserEntity>,
    @InjectRepository(VoteEntity)
    private readonly votesRepository: EntityRepository<VoteEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  public async createUserPost(
    data: CreatePostRequestDto,
    userId: string,
  ): Promise<Result<PostEntity, PostError>> {
    const user = this.usersRepository.getReference(userId);
    const newPost = this.postsRepository.create({
      title: data.title,
      content: data.content,
      author: user,
    });

    try {
      await this.entityManager.flush();
      return ok(newPost);
    } catch (error) {
      console.error(error);
      return err(new PostError('An unexpected error occurred.'));
    }
  }

  public async voteUserPost(
    postId: string,
    userId: string,
    type: VoteType,
  ): Promise<Result<PostEntity, PostError>> {
    try {
      // Get entity references - ValidPostId guard ensures post exists
      const user = this.usersRepository.getReference(userId);
      const post = this.postsRepository.getReference(postId);

      // Find existing vote
      const existingVote = await this.votesRepository.findOne({
        user: { id: userId },
        post: { id: postId },
      });

      if (existingVote) {
        // Update vote if different type
        if (existingVote.type !== type) {
          existingVote.type = type;
          existingVote.updatedAt = new Date();
          await this.entityManager.flush();
        }
      } else {
        // Create new vote
        this.votesRepository.create({ type, user, post });
        await this.entityManager.flush();
      }

      // Get the updated post
      const updatedPost = await this.postsRepository.findOne(
        { id: postId },
        { refresh: true },
      );

      return ok(updatedPost);
    } catch (error) {
      console.error('Vote error:', error);
      return err(new VoteError('Failed to register vote'));
    }
  }

  public async removeUserVote(
    postId: string,
    userId: string,
  ): Promise<Result<PostEntity, PostError>> {
    try {
      // Find existing vote - ValidPostId guard ensures post exists
      const existingVote = await this.votesRepository.findOne({
        user: { id: userId },
        post: { id: postId },
      });

      if (!existingVote) {
        return err(new PostNotVotedError(postId));
      }

      // Remove the vote
      await this.entityManager.removeAndFlush(existingVote);

      // Get the updated post
      const updatedPost = await this.postsRepository.findOne(
        { id: postId },
        { refresh: true },
      );

      return ok(updatedPost);
    } catch (error) {
      console.error('Remove vote error:', error);
      return err(new VoteError('Failed to remove vote'));
    }
  }

  public async updatePost(
    updatePostDto: UpdatePostRequestDto,
    postId: string,
  ): Promise<Result<PostEntity, PostError>> {
    const post = this.postsRepository.getReference(postId);
    post.content = updatePostDto.content;

    await this.entityManager.flush();
    return ok(post);
  }

  public async getPosts(
    query: QueryPostRequestDto,
  ): Promise<Result<{ posts: PostEntity[]; nextCursor?: string }, PostError>> {
    try {
      const limit = query.limit || 10;
      const filter: FilterQuery<PostEntity> = {};

      if (query.title) {
        filter.title = { $ilike: `%${query.title}%` };
      }

      // Apply cursor pagination
      if (query.cursor) {
        try {
          const decodedCursor = Buffer.from(query.cursor, 'base64').toString(
            'utf-8',
          );
          const cursorData = JSON.parse(decodedCursor);

          // Use created timestamp and ID for cursor-based pagination
          // This provides a stable sort order even with same timestamps
          filter.postedAt = { $lte: new Date(cursorData.postedAt) };
          filter.id = { $ne: cursorData.id }; // Exclude the cursor post itself

          // Add a second condition for posts with the exact same timestamp
          // to ensure we don't skip any posts
          const sameDateFilter = {
            postedAt: { $eq: new Date(cursorData.postedAt) },
            id: { $lt: cursorData.id }, // For same date, sort by ID
          };

          filter.$or = [
            { postedAt: { $lt: new Date(cursorData.postedAt) } },
            sameDateFilter,
          ];
        } catch {
          return err(new PostError('Invalid cursor format'));
        }
      }

      const posts = await this.postsRepository.find(filter, {
        limit: limit + 1,
        orderBy: { postedAt: 'DESC', id: 'DESC' },
        populate: ['author'],
      });

      const hasMore = posts.length > limit;
      const results = hasMore ? posts.slice(0, limit) : posts;

      let nextCursor: string | undefined;
      if (hasMore && results.length > 0) {
        const lastPost = results[results.length - 1];
        const cursorData = {
          postedAt: lastPost.postedAt.toISOString(),
          id: lastPost.id,
        };
        nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64');
      }

      return ok({
        posts: results,
        nextCursor,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return err(new PostError('Failed to fetch posts'));
    }
  }
}
