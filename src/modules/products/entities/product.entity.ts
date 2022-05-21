import { Branch } from 'src/commons/enums/branch.entity';
import { Store } from './../../store/entities/store.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import {Status} from '../../../commons/enums/product.status.enum';
import {Type} from '../../../commons/enums/product.type.enum';

@Entity('products')
export class Product extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Branch,
  })
  branch: Branch;


  @Column()
  count: number;

  @Column({
    default: ''
  })
  nameofsupplier: string;

  @Column({
    default: ''
  })
  phoneofsupplier: string;

  @Column({
    default: ''
  })
  supplieredCompany: string;

  @Column({
    default: ''
  })
  description: string;

  @Column({
    default: ''
  })
  createdAt: string;

  @ManyToOne(type => Store, store => store.products, {
    eager: false
  })
  store: Store;


  // Foreign Key
  @Column({
    nullable: true
  })
  storeId: number

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Type,
    nullable: true
  })
  type: Type;

  
  @Column({
    default: false
  })
  accept: Boolean;

}
