import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dtos/create-post-request.dto';
import { UserId } from '../auth/decorators/user.decorator';
import { AuthenticatedOnly } from '../auth/guards/authenticated.guard';
import { Response } from 'express';
import { ValidPostId } from './guards/valid-post-id.guard';
import { VotePostRequestDto } from './dtos/vote-post-request.dto';
import { PostOwnerOnly } from './guards/post-owner-only.guard';
import { UpdatePostRequestDto } from './dtos/update-post-request.dto';
import { QueryPostRequestDto } from './dtos/query-post-request.dto';

@UseGuards(ValidPostId)
@Controller({
  version: '1',
  path: 'posts',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public async getPosts(
    @Query() query: QueryPostRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.postsService.getPosts(query);

    if (result.isOk())
      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          posts: result.value.posts,
          pagination: {
            nextCursor: result.value.nextCursor,
          },
        },
      });
    else
      return res.status(result.error.statusCode).json({
        success: false,
        error: result.error.toJSON(),
      });
  }

  @UseGuards(AuthenticatedOnly)
  @Post()
  public async createPost(
    @Body() createPostDto: CreatePostRequestDto,
    @UserId() userId: string,
    @Res() res: Response,
  ) {
    const newPost = await this.postsService.createUserPost(
      createPostDto,
      userId,
    );

    if (newPost.isOk())
      return res.status(HttpStatus.CREATED).json(newPost.value);
    else
      return res.status(newPost.error.statusCode).json(newPost.error.toJSON());
  }

  @UseGuards(AuthenticatedOnly)
  @Patch(':postId/vote')
  public async votePost(
    @Param('postId') postId: string,
    @Body() voteDto: VotePostRequestDto,
    @UserId() userId: string,
    @Res() res: Response,
  ) {
    const result = await this.postsService.voteUserPost(
      postId,
      userId,
      voteDto.type,
    );

    if (result.isOk()) return res.status(HttpStatus.OK).json(result.value);
    else return res.status(result.error.statusCode).json(result.error.toJSON());
  }

  @UseGuards(AuthenticatedOnly)
  @Patch(':postId/un-vote')
  public async removeVote(
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Res() res: Response,
  ) {
    const result = await this.postsService.removeUserVote(postId, userId);

    if (result.isOk()) return res.status(HttpStatus.OK).json(result.value);
    else return res.status(result.error.statusCode).json(result.error.toJSON());
  }

  @UseGuards(PostOwnerOnly)
  @Patch(':postId/content')
  public async updateContent(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.postsService.updatePost(updatePostDto, postId);

    if (result.isOk()) return res.status(HttpStatus.OK).json(result.value);
    else return res.status(result.error.statusCode).json(result.error.toJSON());
  }
}
