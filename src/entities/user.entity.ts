import { RoomJoin } from './roomJoin.entity';
import { Inquiry } from './inquiry.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Auth } from './auth.entity';
import { Setting } from './setting.entity';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => Setting, (setting) => setting.user)
    @JoinColumn()
    setting?: Setting;
    
    @OneToOne(() => Auth, auth => auth.user)
    @JoinColumn()
    auth?: Auth;

    @OneToMany(() => Inquiry, inquiry => inquiry.user)
    inquiry?: Inquiry[];

    @Column()
    email?: string;

    @Column()
    password?: string;

    @Column()
    nickname?: string;
    
    @Column()
    phone?: string;

    // @Column()
    // name?: string;
    
    // @Column()
    // birth?: string;
    
    // @Column()
    // sex?: string;
    
    // @Column()
    // temp_uuid?: string;

    // @Column()
    // token?: string;

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

}