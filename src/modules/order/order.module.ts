import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrderRepository } from './repositories/order.repository';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';

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
    TypeOrmModule.forFeature([OrderRepository,Order]),
  ],
  providers: [OrderService], 
  controllers: [OrderController],
  exports: [OrderService,PassportModule,JwtModule], 
})
export class OrderModule {
}
