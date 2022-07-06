import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'tag'})
export class Tag {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @OneToMany(() => RoomTag, roomTag => roomTag.tag)
    room_tag?: RoomTag;

    @Column()
    name?: string;
    
    @Column()
    is_popular?: boolean;

    @ManyToOne(() => Tag, tag => tag.children)
    parent: Tag;

    @OneToMany(() => Tag, tag => tag.parent)
    children: Tag[]
}