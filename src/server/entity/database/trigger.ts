import {Table, PrimaryColumn, Column, ManyToOne, Index} from 'typeorm';
import {Action} from './action';
import {User} from './user';

@Table('Triggers')
@Index('unique_type_source', ['type', 'source'], { unique: true })
export class Trigger {

    @PrimaryColumn('string', {unique: true, nullable: false})
    name: String;

    // What we are triggered by (e.g. Reactions to messages, what someone typed when the bot is @ed, conversation events)
    @Column('string', {nullable: false})
    type: String;

    @Column('string', {nullable: false})
    source: String;

    @Column('string', {nullable: false})
    @ManyToOne(type => Action, action => action.name, {primary: false, nullable: false, lazy: false})
    action: Action;

    @Column('string', {nullable: false})
    @ManyToOne(type => User, user => user.name, {primary: false, nullable: false, lazy: false})
    user: User;
}
