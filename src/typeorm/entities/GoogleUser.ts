import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'googleUsers' })
export class GoogleUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;
}
