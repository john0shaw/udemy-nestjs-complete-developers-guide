import { 
    AfterInsert, 
    AfterRemove,
    AfterUpdate,
    Entity, 
    Column, 
    PrimaryGeneratedColumn 
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    LogInsert() {
        console.log('Inserted User with id', this.id);
    }

    @AfterRemove()
    LogRemove() {
        console.log('Removed user with id', this.id);
    }

    @AfterUpdate()
    LogUpdate() {
        console.log('Updated User with id', this.id);
    }
}