import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, ManyToOne, Index } from 'typeorm';

@Entity({name: 'tag'})
export class Tag {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @OneToMany(() => RoomTag, roomTag => roomTag.tag)
    room_tag?: RoomTag;

    @Index()
    @Column({
        unique: true
    })
    name?: string;

    @Column({
        default: false,
        nullable: true
    })
    is_popular: boolean;
}