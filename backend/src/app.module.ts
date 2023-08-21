import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "reflect-metadata";
import { SharedModule } from "./shared/shared.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    ArticleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "uploads"),
      serveRoot: "/uploads",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
