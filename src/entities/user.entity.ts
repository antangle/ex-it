import { Alarm } from './alarm.entity';
import { Review } from './review.entity';
import { RoomJoin } from './roomJoin.entity';
import { Inquiry } from './inquiry.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, Index, DeleteDateColumn } from 'typeorm';
import { Auth } from './auth.entity';
import { Setting } from './setting.entity';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => Setting, (setting) => setting.user)
    @JoinColumn()
    setting?: Setting;
    
    @OneToMany(() => Auth, auth => auth.user)
    auth?: Auth[];

    @OneToMany(() => Inquiry, inquiry => inquiry.user)
    inquiry?: Inquiry[];

    @OneToMany(() => Review, review => review.user)
    review?: Review[];

    @OneToMany(() => RoomJoin, roomJoin => roomJoin.user)
    room_join?: RoomJoin[];

    @JoinColumn()
    @OneToOne(() => Alarm, alarm => alarm.user)
    alarm?: Alarm;

    @Index({
        unique: true
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
    
    // @Column()
    // birth?: string;
    
    // @Column()
    // sex?: string;
    
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

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @Column({
        nullable: true
    })
    is_authenticated?: boolean;
}