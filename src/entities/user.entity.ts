import { Review } from './review.entity';
import { RoomJoin } from './roomJoin.entity';
import { Inquiry } from './inquiry.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, Index, DeleteDateColumn } from 'typeorm';
import { Auth } from './auth.entity';
import { Ban } from './ban.entity';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @OneToMany(() => Auth, auth => auth.user)
    auth?: Auth[];

    @OneToMany(() => Inquiry, inquiry => inquiry.user)
    inquiry?: Inquiry[];

    @OneToMany(() => Review, review => review.user)
    review?: Review[];

    @OneToMany(() => RoomJoin, roomJoin => roomJoin.user)
    room_join?: RoomJoin[];
    
    @OneToMany(() => Ban, ban => ban.user)
    ban?: Ban[];



    @Column({
        default: true
    })
    alarm?: boolean = false;

    @Index({
        unique: true,
        where: 'deleted_at IS NULL'
    })
    @Column()
    email?: string;
    
    @Column({
        nullable: true
    })
    password?: string;
    
    @Column({
        unique: true
    })
    nickname?: string;
    
    @Column({
        nullable: true
    })
    phone?: string;
    
    @Column({
        nullable: true
    })
    refresh_token?: string;

    // @Column()
    // name?: string;
    
    @Column({
        nullable: true
    })
    birth?: string;
    
    @Column({
        nullable: true
    })
    sex?: string;
    
    // @Column()
    // temp_uuid?: string;


    // @Column()
    // profile_url?: string;

    @Column()
    terms?: boolean;

    @Column()
    personal_info_terms?: boolean;

    @Column({
        default: false
    })
    is_identified?: boolean;

    @CreateDateColumn({type: 'timestamptz'})
    created_at?: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updated_at?: Date;

    @DeleteDateColumn({type: 'timestamptz'})
    deleted_at?: Date;

    @Column({
        nullable: true
    })
    is_authenticated?: boolean;
}