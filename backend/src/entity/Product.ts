import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index({ unique: true })
	@Column({ type: "varchar", length: 100 })
	article!: string; // unique

	@Column({ type: "varchar", length: 255 })
	name!: string; // required

	@Column({ type: "numeric", precision: 12, scale: 2 })
	price!: string; //сохранить как строку из числового

	@Column({ type: "integer", default: 0 })
	quantity!: number; // >= 0

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;
}
