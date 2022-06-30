import { SubTag } from './subtag.entity';
import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'tag'})
export class Tag {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @OneToMany(() => RoomTag, roomTag => roomTag.tag)
    roomTag?: RoomTag;
  
    @OneToMany(() => SubTag, subTag => subTag.tag)
    subtag?: SubTag;
  
    @Column()
    is_popular?: boolean;
}