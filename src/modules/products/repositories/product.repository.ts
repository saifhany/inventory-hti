import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { BadRequestException, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { Status } from '../../../commons/enums/product.status.enum';
import { Type } from '../../../commons/enums/product.type.enum';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async getFilteredProducts( type: Type,name: string,limit: number,skip: number): Promise<Product[]> {
    const query = this.createQueryBuilder('product').select("product.id").addSelect("product.name").addSelect("product.type").addSelect("product.status").addSelect("product.description").addSelect("product.count").addSelect("product.createdAt")
    if(limit){
      query.limit(limit);
    }
    if(skip){
      query.skip(skip);
    }
    query.where('product.status =:status',{status:Status.INSTORE})
    if(type){
      query.andWhere('product.type =:type',{type})
    }
    // LIKE '%books%'
    if(name){
      query.andWhere("LOWER(name) LIKE :name", { name: `%${ name.toLowerCase() }%` })
    }
    // query.("product.password").excludeSelect("product.salt");
    const result = await query.getMany();
    const productCount = result.length;
    return result;
  }
  

}
