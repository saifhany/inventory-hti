import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
// import {Status} from '../../../commons/enums/order-status.enum';
import { Branch } from './../../../commons/enums/branch.entity';
import { OrderStatus } from './../../../commons/enums/order.status';

@Entity('orders')
export class Order extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  // @Column("jsonb")
  // orderedProducts: JSON[];

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
})
 orderedProducts!: Array<{}>;
  //  @Column('jsonb')
  //  tasks: Foo[];

  // @Column("simple-json")
  // orderedName:{ name: string; count: number }
  @Column({
    type: 'enum',
    enum: Branch,
  })
  branch: Branch;
  
  @Column({
    type: 'enum',
    enum: OrderStatus,

  })
  acceptFromManagerStore: OrderStatus;

  @Column()
  notes: string;

  @Column({
    default: ''
  })
  dateOfOrder: string;

  @Column({
    default: ''
  })
  dateOfsent: string;

  @ManyToOne(type => User, user => user.orders, {
    eager: false
  })
  user: User;

  // Foreign Key
  @Column()
  userId: number

  @Column({nullable: true})
  whoCreatedOrder: string;
  
  @Column({nullable: true})
  whoAcceptOrder: string;
  // @Column({
  //   type: 'enum',
  //   enum: Status,
  //   array: true,
  // })
  // status: Status[];

}
