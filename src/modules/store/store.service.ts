import {
    BadRequestException,
    ConflictException, 
    HttpException,
    HttpStatus, 
    Injectable,
    NotFoundException,
    Get ,
    Response,
    Res,
    Req
  } from '@nestjs/common';
  
  import { Store } from './entities/store.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  // import { ProductRepository } from './repositories/store.repository';
  import { Role } from '../../commons/enums/role.enum';
  import { JwtPayload } from '../../commons/interfaces/jwt-payload.interface';
  import { JwtService } from '@nestjs/jwt';
  import {Status} from '../../commons/enums/product.status.enum';
import { User } from '../auth/entities/user.entity';
import { Branch } from 'src/commons/enums/branch.entity';
import { Type } from 'src/commons/enums/product.type.enum';
import { Product } from '../products/entities/product.entity';
import { Like } from 'typeorm';
  
  @Injectable()
  export class StoreService {
    constructor() {
    }
  

    async getStoreData(id:number,@Response() res,name:string,type:Type): Promise<any> {

      const user = await User.findOne({where:{id:id}});
      // const  store = await Store.find();
      if(user.branch){
        const  store = await Store.findOne({ where:{ branch:user.branch}});
        // const  store = await Store.findOne({ where:{ branch:Branch.TENTHOFRAMADAN , name:Like(`%${name}%`)  }   });
        const Products = store.products.filter(p => { 
          return  p.name.includes(name)  || p.type === type
        });
        console.log(store);
        return res.json({
          status: true,
          data:Products
        })
      } else {
        return res.json({ status: false, message: 'store not found' });
      }    
    }

    async addproductToStore(@Response() res, id:number,productId:number ,name: string, count: number,nameofsupplier:string , phoneofsupplier:string, supplieredCompany:string,description:string , type:Type,accept:boolean  ): Promise<any> {
      if(accept === false){
        const outOfStoreProduct = await Product.findOne({where:{id:productId}});
        if(outOfStoreProduct){  
         await Product.delete({id:outOfStoreProduct.id});
         return res.json({
            status: false,
             message: 'تم حذف المنتج بنجاح'
             });
        }
      }
    const user = await User.findOne({where:{id:id}});
    const store = await Store.findOne({where:{branch:user.branch}});
    if(user.branch === store.branch){

      const  existproductInStore =  await store.products.find(product => (product.name === name && product.supplieredCompany === supplieredCompany && product.status ==="INSTORE" && product.type === type &&  product.branch===user.branch));
      
      if(existproductInStore){
        const ExistProduct = existproductInStore.id; 
        const product = await Product.findOne({where:{id:ExistProduct}});
        product.count += count;
        product.accept = accept;
        const outOfStoreProduct = await Product.findOne({where:{id:productId}});
        await Product.delete({id:outOfStoreProduct.id});
        await product.save();
        return res.json({
          status: true,
          data:product,
          message:"تم تحديث المنتج بنجاح"
        })
      } else{
        const product = await new Product();
        
        product.name = name;
        product.count = count;
        product.nameofsupplier = nameofsupplier;
        product.phoneofsupplier = phoneofsupplier;
        product.supplieredCompany = supplieredCompany;
        product.description = description;
        product.type = type;
        product.accept = accept;
        product.branch = user.branch;
        if(accept === true){
          product.status = Status.INSTORE;
        }
        product.store = store;
        await product.save();
        const outOfStoreProduct = await Product.findOne({where:{id:productId}});
        await Product.delete({id:outOfStoreProduct.id});
        return res.json({
          status: true,
          data:product,
          message:"تم تحديث المنتج بنجاح"
        })
      }
    

   
    }
    
  }
  
}