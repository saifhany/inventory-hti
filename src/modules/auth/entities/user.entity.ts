import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../../../commons/enums/role.enum';
import { Branch } from '../../../commons/enums/branch.entity';
import { SECTION } from '../../../commons/enums/section.type';
import * as bcrypt from 'bcryptjs';
import { Order } from '../../order/entities/order.entity';

@Entity('users')
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
     nullable: true
  })
  password: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  salt: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.DEFAULT,
    nullable: true,
  })
  roles?: Role;

  @Column({
    type: 'enum',
    enum: SECTION,
    default: SECTION.DEFAULT,
    nullable: true,
  })
  sections?: SECTION;

  @Column({
    type: 'enum',
    enum: Branch,
    // array: true,
    default:Branch.DEFAULT,
    nullable: true,
  })
  branch?: Branch;



  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  
  @OneToMany(type => Order, order => order.user, {
    eager: true,
  })
  orders: Order[];



 

}
