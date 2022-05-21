import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { JwtStrategy } from './stratigies/jwt-strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: AuthConstants.secretKey,
      signOptions: {
        expiresIn: AuthConstants.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository,User]),
    
  ],
  providers: [AuthService,JwtStrategy], 
  controllers: [AuthController],
  exports: [AuthService,PassportModule,JwtModule,JwtStrategy], 
})
export class AuthModule {
}
