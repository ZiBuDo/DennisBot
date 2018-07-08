import {Table, Column, PrimaryColumn, ManyToOne} from 'typeorm';
import {Contents} from '../internal/contents';
import {User} from './user';

@Table('Actions')
export class Action {

    @PrimaryColumn('string', {unique: true, nullable: false})
    name: String;

    @Column('string', {nullable: false})
    type: String;

    @Column('json')
    contents: Contents;

    @Column('string', {nullable: false})
    @ManyToOne(type => User, user => user.name, {primary: false, nullable: false, lazy: false})
    user: User;
}
