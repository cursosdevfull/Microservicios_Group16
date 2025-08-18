import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "appointment-pe" })
export class AppointmentEntity {
    @PrimaryColumn()
    appointmentId!: string;

    @Column({ type: "varchar", length: 100 })
    scheduleId!: string;

    @Column({ type: "varchar", length: 100 })
    userId!: string;

    @Column({ type: "varchar", length: 20, default: "pending" })
    status!: string;

    @Column({ type: "varchar", length: 2 })
    countryISO!: string;

    @Column({ type: "timestamp" })
    createdAt!: Date;
}