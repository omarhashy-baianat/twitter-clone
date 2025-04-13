import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { MediaModule } from 'src/media/media.module';
import { FileIdValidator } from 'src/validators/file-id.validator';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), MediaModule],
  providers: [UsersService, UsersResolver, FileIdValidator],
  exports: [UsersService],
})
export class UsersModule {}
