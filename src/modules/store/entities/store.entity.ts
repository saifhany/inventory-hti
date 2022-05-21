import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import {Branch} from '../../../commons/enums/branch.entity';
import {Product} from '../../products/entities/product.entity'
@Entity('stores')
export class Store extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    type: 'enum',
    enum: Branch,
  })
  branch: Branch;

  
  @OneToMany(type => Product, product => product.store , {
    eager: true,
  })
  products: Product[];


}
