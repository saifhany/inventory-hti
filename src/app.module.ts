import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/product.module';
import { OrderModule } from './modules/order/order.module';
import { StoreModule } from './modules/store/store.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {config} from '../config';


@Module({
  imports: [
    TypeOrmModule.forRoot(config.db2 as TypeOrmModuleOptions)
    ,AuthModule,
    ProductModule,
    StoreModule,
    OrderModule
  ],
  controllers: [AppController],
  
})
export class AppModule {}
