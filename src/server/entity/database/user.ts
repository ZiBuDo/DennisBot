import {Table, PrimaryColumn, Column} from 'typeorm';

@Table('Users')
export class User {

    @PrimaryColumn('string', {unique: true, nullable: false})
    name: String;

    @Column('string', {nullable: false})
    source: String;
}
