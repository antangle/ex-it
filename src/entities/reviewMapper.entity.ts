import { Reply } from './reply.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'review_mapper'})
export class ReviewMapper {
    @ApiProperty({
        description: '해당 리뷰 id',
        default: 1
    })
    @PrimaryGeneratedColumn()
    id?: number;
    
    @ApiProperty({
        description: '해당 리뷰 내역',
        default: '시원하게 쏴대는'
    })
    @Column()
    title?: string;

}