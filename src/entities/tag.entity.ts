import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, ManyToOne, Index } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({name: 'tag'})
export class Tag {
    @ApiProperty({
        description: '태그 id'
    })
    @PrimaryGeneratedColumn()
    id?: number;
    
    @ApiHideProperty()
    @OneToMany(() => RoomTag, roomTag => roomTag.tag)
    room_tag?: RoomTag;
    
    @ApiProperty({
        description: '태그 명'
    })
    @Index()
    @Column({
        unique: true
    })
    name?: string;
    
    @ApiHideProperty()
    @Column({
        default: false,
        nullable: true
    })
    is_popular?: boolean;
}