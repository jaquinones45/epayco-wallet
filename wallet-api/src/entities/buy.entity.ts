import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Wallet } from './wallet.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

import { StateProduct } from '../modules/products/dto/state-product.dto';

@Entity('buys')
export class Buy {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  idSession: string;

  @Column({ nullable: true })
  token: number;

  @Column({ nullable: true })
  product_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({
    type: 'enum',
    enum: StateProduct,
    default: StateProduct.PENDING,
  })
  state: StateProduct;

  @ManyToOne(() => Product, (product) => product.buys)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.buys)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ default: 0, type: 'bigint' })
  deletedAt: number;
}
