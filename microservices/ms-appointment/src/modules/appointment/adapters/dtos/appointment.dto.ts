import { AppointmentEntity } from "../models/appointment.entity";
import { Appointment, APPOINTMENT_STATUS, COUNTRY_ISO } from '../../application/appointment';

export class AppointmentDto {
    static fromDomainToData(domain: Appointment | Appointment[]): AppointmentEntity | AppointmentEntity[] {
        if (Array.isArray(domain)) {
            return domain.map(appointment => this.fromDomainToData(appointment)) as AppointmentEntity[];
        }

        const appointmentEntity = new AppointmentEntity();
        appointmentEntity.appointmentId = domain.properties.appointmentId!;
        appointmentEntity.scheduleId = domain.properties.scheduleId!;
        appointmentEntity.userId = domain.properties.userId!;
        appointmentEntity.countryISO = domain.properties.countryISO!;
        appointmentEntity.createdAt = domain.properties.createdAt!;
        appointmentEntity.status = domain.properties.status!;
        return appointmentEntity;
    }

    static fromDataToDomain(data: AppointmentEntity | AppointmentEntity[]): Appointment | Appointment[] {
        if (Array.isArray(data)) {
            return data.map(appointmentEntity => this.fromDataToDomain(appointmentEntity)) as Appointment[];
        }

        return new Appointment({
            appointmentId: data.appointmentId,
            scheduleId: data.scheduleId,
            userId: data.userId,
            countryISO: data.countryISO as COUNTRY_ISO,
            createdAt: data.createdAt,
            status: data.status as APPOINTMENT_STATUS
        });
    }
}