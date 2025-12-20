import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISpecialty } from "./specialty.interface";


@Entity({name:"specialties"})
export class Specialty implements ISpecialty {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar',nullable:false  })
    name:string;

    @Column({type:"varchar",nullable:true})
    description:string;

    @CreateDateColumn({name:'created_at'})
    created_at:Date;

    @UpdateDateColumn({name:'updated_at'})
    updated_at:Date;

}
