import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from "../../shared/dtos/base-api-response.dto";
import { PaginationParamsDto } from "../../shared/dtos/pagination-params.dto";
import { AppLogger } from "../../shared/logger/logger.service";
import { ReqContext } from "../../shared/request-context/req-context.decorator";
import { RequestContext } from "../../shared/request-context/request-context.dto";
import {
  CreateArticleInput,
  UpdateArticleInput,
} from "../dtos/article-input.dto";
import { ArticleOutput } from "../dtos/article-output.dto";
import { ArticleService } from "../services/article.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import {
  editFileName,
  imageFileFilter,
} from "src/shared/utils/file-upload.utils";
import { diskStorage } from "multer";

@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(ArticleController.name);
  }

  @Post()
  @ApiOperation({
    summary: "Create article API",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileInterceptor("imageContent", {
      storage: diskStorage({
        destination: "./uploads",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateArticleInput,
    @UploadedFile() image: Express.Multer.File
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.createArticle(ctx, input, image);
    return { data: article, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: "Get articles as a list API",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([ArticleOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getArticles(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto
  ): Promise<BaseApiResponse<ArticleOutput[]>> {
    this.logger.log(ctx, `${this.getArticles.name} was called`);

    const { articles, count } = await this.articleService.getArticles(
      ctx,
      query.limit,
      query.offset
    );

    return { data: articles, meta: { count } };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get article by id API",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getArticle(
    @ReqContext() ctx: RequestContext,
    @Param("id") id: number
  ): Promise<BaseApiResponse<ArticleOutput>> {
    this.logger.log(ctx, `${this.getArticle.name} was called`);

    const article = await this.articleService.getArticleById(ctx, id);
    return { data: article, meta: {} };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update article API",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileInterceptor("imageContent", {
      storage: diskStorage({
        destination: "./uploads",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @ReqContext() ctx: RequestContext,
    @Param("id") articleId: number,
    @Body() input: UpdateArticleInput,
    @UploadedFile() image: Express.Multer.File
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.updateArticle(
      ctx,
      articleId,
      input,
      image
    );
    return { data: article, meta: {} };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete article by id API",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @ReqContext() ctx: RequestContext,
    @Param("id") id: number
  ): Promise<void> {
    this.logger.log(ctx, `${this.deleteArticle.name} was called`);

    return this.articleService.deleteArticle(ctx, id);
  }
}
