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
  
  import { Order } from './entities/order.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { OrderRepository } from './repositories/order.repository';
  import { Role } from '../../commons/enums/role.enum';
  import { JwtPayload } from '../../commons/interfaces/jwt-payload.interface';
  import { JwtService } from '@nestjs/jwt';
  import {Status} from '../../commons/enums/product.status.enum';
  import {Type} from '../../commons/enums/product.type.enum';
import { OrderStatus } from 'src/commons/enums/order.status';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
  @Injectable()
  export class OrderService {
    constructor(@InjectRepository(OrderRepository) private orderRepository: OrderRepository,) {}


    // whoCreatedOrder   whoAcceptOrder

   async createOrder(id: number, orderedProducts: Array<{}> , notes: string , @Response() res ): Promise<any> {
      const user = await User.findOne({where:{id:id}});
      const order =  await new Order();
      order.userId = id;
      order.acceptFromManagerStore = OrderStatus.PENDING;
      order.notes = notes;
      order.orderedProducts = orderedProducts;
      order.branch = user.branch;
      order.whoCreatedOrder = user.username;
      let dt = new Date();
         dt.setHours( dt.getHours() + 2 );
      order.dateOfOrder = dt.toLocaleString();
    const createdOrder =   await order.save();
    if(createdOrder){
      return res.json({
        status: true,
        message: 'تمت اضافه الطلب بنجاح',
        data: createdOrder,
      });
    }
    else{
      return res.json({
        status: false,
        message: 'حدث خطأ ما',
      });
    } 
  }


  async getOrders(id:number,@Response() res,orderstatus:OrderStatus): Promise<any> {
    const user = await User.findOne({where:{id:id}});
      if (user){
        const orders = await Order.find({where:{acceptFromManagerStore:orderstatus,branch:user.branch}});
        // const products = orders.orderedProducts.filter(product => {
        //   return product.productname.includes(name) });
        if(orders){
          return res.json({
            status: true,
            message: 'تم الحصول على الطلبات بنجاح',
            data: orders,
          });
        }
        else{
          return res.json({
            status: false,
            message: 'حدث خطأ ما',
          });
        }
      }
  }
  //  id, acceptFromManagerStore, res
  
  async updateOrder(userId:number,id: number, acceptFromManagerStore: OrderStatus, @Response() res): Promise<any> {
    const user = await User.findOne({where:{id:userId}});

    const orderById = await Order.findOne({where:{id:id}});
        
        if(orderById){
          const CheckProductsCountInStore =  async (productsId,productcount)=> {
            let bool = false;
          
            for(let i = 0; i < productsId.length; i++) {
              const updateProductStatusInStore = await Product.findOne({where:{id: productsId[i]} })
              if(updateProductStatusInStore.count < productcount[i]){
                console.log(bool);
                bool = true;
                res.json({ status: false, message: 'لا يوجد كميه كافيه' });
                break;
              } 
            }  
            return bool;
          }

          const productsId =  orderById.orderedProducts.map((product) => {
            let result = Object.entries(product).map(( [k, v] ) => ({ [k]: v }));
            return result[0].id;
            });

            const ProductsCounts =  orderById.orderedProducts.map((product) => {
              let result = Object.entries(product).map(( [k, v] ) => ({ [k]: v }));
              return result[1].count;
              });
             
          if(acceptFromManagerStore === OrderStatus.ACCEPTED && ! await CheckProductsCountInStore(productsId,ProductsCounts) ){
            
              console.log('accepted');
            const updateProductStatusInStore = async (id,count)=> {
              const updateProductStatusInStore = await Product.findOne({where:{id:id}});
                updateProductStatusInStore.count -= count;
                updateProductStatusInStore.save();         
             }
            for(let i = 0; i < productsId.length; i++) {
                await updateProductStatusInStore(productsId[i],ProductsCounts[i]);
            } 
            orderById.acceptFromManagerStore = acceptFromManagerStore;
            orderById.whoAcceptOrder = user.username;
            let dt = new Date();
            dt.setHours( dt.getHours() + 2 );
            orderById.dateOfsent = dt.toLocaleString();
            const updatedOrder = await orderById.save();
            if(updatedOrder){
              return res.json({
                status: true,
                message: 'تم تحديث الطلب بنجاح',
                data: updatedOrder,
              });
            }
          }  
          if(acceptFromManagerStore === OrderStatus.NOTFOUND){
            orderById.acceptFromManagerStore = acceptFromManagerStore;
            const updatedOrder = await orderById.save();
            if(updatedOrder){
              return res.json({
                status: true,
                message: 'تم تحديث الطلب بنجاح',
                data: updatedOrder,
              });
            }
          }         
        }
    }
  // boolean be true if time is over
  
  async  getOrder(id:number, @Response() res): Promise<any> {
    const orderById = await Order.findOne({where:{id:id}});
    if(orderById){
      return res.json({
        status: true,
        message: 'تم الحصول على الطلب بنجاح',
        data: orderById,
      });
    }
    else{
      return res.json({
        status: false,
        message: 'حدث خطأ ما',
      });
    }
  }
}



  