import {Table, PrimaryColumn} from 'typeorm';

@Table('Users')
export class User {

    @PrimaryColumn('string', {unique: true, nullable: false})
    name: String;
}
