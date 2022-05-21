import {
    BadRequestException,
    ConflictException, 
    HttpException,
    HttpStatus, 
    Injectable,
    NotFoundException,
    Get ,
    Response,
    Res
  } from '@nestjs/common';
  
  import { Product } from './entities/product.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { ProductRepository } from './repositories/product.repository';
  import { Role } from '../../commons/enums/role.enum';
  import { JwtPayload } from '../../commons/interfaces/jwt-payload.interface';
  import { JwtService } from '@nestjs/jwt';
  import {Status} from '../../commons/enums/product.status.enum';
  import {Type} from '../../commons/enums/product.type.enum';
import { User } from '../auth/entities/user.entity';
  @Injectable()
  export class ProductService {
    constructor(@InjectRepository(ProductRepository) private productRepository: ProductRepository,
                ) {
    }
  
    async createProduct(id:number,type:Type,name: string, count: number,nameofsupplier:string,phoneofsupplier:string,supplieredCompany:string,description:string, @Response() res ): Promise<any> {
        if(!nameofsupplier  || !phoneofsupplier  || !supplieredCompany  || !name  || !count || !type){
         return   res.json({ status: false, message: 'لم يتم ادخال البيانات بشكل صحيح' });
        }
        const user = await User.findOne({where:{id:id}});
          const branch =   user.branch;
          console.log(branch);
      const product = new Product();
      product.name = name;
      product.type = type;
      product.count = count;
      product.nameofsupplier = nameofsupplier;
      product.phoneofsupplier = phoneofsupplier;
      product.supplieredCompany = supplieredCompany;
      product.description = description;
      product.status = Status.OUTFSTORE;
      product.accept = false;
      product.branch = branch;
      let dt = new Date();
         dt.setHours( dt.getHours() + 2 );
      product.createdAt = dt.toLocaleString();
      try {
        await this.productRepository.save(product);
        // await product.save();
        // res.status(HttpStatus.CREATED).send(product);
        return  res.json({ status: true, message: 'تمت اضافه المنتج بنجاح!', data: product });
      } catch (error) {
        if (error.code === '23505') {
            return    res.json({ status: false, message: ' حدث خطأ عند اضافه البيانات' });
        } else {
            return    res.json({ status: false, message: ' حدث خطأ عند اضافه البيانات' });
        }
      }
    }
    async updateProduct(type:Type,id:number,name: string, count: number,nameofsupplier:string,phoneofsupplier:string,supplieredCompany:string,description:string, @Response() res ): Promise<any> {
      const product = await this.productRepository.findOne({id:id});
      product.name = name ||name;
      product.count = count ||count;
      product.nameofsupplier = nameofsupplier ||nameofsupplier;
      product.phoneofsupplier = phoneofsupplier ||phoneofsupplier;
      product.supplieredCompany = supplieredCompany ||supplieredCompany;
      product.description = description ||description;
      product.type = type ||type;
      try {
        await this.productRepository.save(product);
        // await product.save();
        // res.status(HttpStatus.CREATED).send(product);
        return  res.json({ status: true, message: 'تم تحديث المنتج بنجاح', data: product });
      } catch (error) {
        if (error.code === '23505') {
            return    res.json({ status: false, message: ' حدث خطأ عند تعديل البيانات' });
        } else {
            return    res.json({ status: false, message: ' حدث خطأ عند تعديل البيانات' });
        }
      }
    }

    async getById(id: number, @Response() res): Promise<any> {
      const product = await this.productRepository.findOne({id:id});
      if (!product) {
        return  res.json({ status: false, message: 'لا يوجد منتج بهذا الرقم' });
      }
      return  res.json({ status: true, message: 'تم العثور على المنتج', data: product });
    }
      
    async getAllInStore(@Response() res,type:Type,name:string,limit:number,skip:number): Promise<any> {
      // return await this.userRepository.getFilteredUsers(limit,roles,username,skip,sections,branch,res);
      const products = await this.productRepository.getFilteredProducts(type,name,limit, skip);
      if (!products) {
        return  res.json({ status: false, message: 'لا يوجد منتجات في المخزن' });
      }
      return  res.json({ status: true, message: 'تم العثور على المنتجات', data: products });
    }

    async getAllOutOfStore(id:number,@Response() res,type:Type): Promise<any> {
      const user = await User.findOne({where:{id:id}});
      const branch =   user.branch;
      const products = await this.productRepository.find({status:Status.OUTFSTORE,type:type,branch:branch});
      if (!products) {
        return  res.json({ status: false, message: 'لا يوجد منتجات في المخزن' });
      }
      return  res.json({ status: true, message: 'تم العثور على المنتجات', data: products });
    }

    
      
    
   
  }
  