import { Tag } from './tag.entity';
import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'subtag'})
export class SubTag {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Tag, tag => tag.subtag)
    tag: Tag;

    @Column()
    name?: string;
}