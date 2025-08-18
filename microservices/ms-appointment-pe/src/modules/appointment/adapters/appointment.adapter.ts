import { DatabaseBootstrap } from "@core/bootstrap";
import { Appointment, APPOINTMENT_STATUS } from "../application/appointment";
import { AppointmentPort } from "../ports/appointment.port";
import { AppointmentEntity } from './models/appointment.entity';
import { AppointmentDto } from "./dtos/appointment.dto";
import { KafkaService } from "@core/services/kafka.service";
import { env } from '../../../env';

export class AppointmentAdapter implements AppointmentPort {
    async save(appointment: Appointment): Promise<Appointment> {
        try {
            await this.saveDatabase(appointment);
            await this.saveEventBroker(appointment)
            return appointment;
        } catch (error) {
            appointment.updateStatus(APPOINTMENT_STATUS.CANCELED);
            const listPromise = [this.saveEventBroker(appointment), this.saveEventBrokerError(appointment)];
            await Promise.all(listPromise);
            throw new Error(`Failed to save appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async saveDatabase(appointment: Appointment): Promise<Appointment> {
        try {
            const repository = DatabaseBootstrap.dataSource.getRepository(AppointmentEntity);
            const appointmentEntity = AppointmentDto.fromDomainToData(appointment) as AppointmentEntity;
            appointmentEntity.status = APPOINTMENT_STATUS.CONFIRMED; // Ensure status is set to CONFIRMED
            await repository.save(appointmentEntity);
            return appointment;
        } catch (error) {
            console.error("Error saving appointment:", error);
            throw new Error(`Failed to save appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async saveEventBroker(appointment: Appointment): Promise<void> {
        const { appointmentId, scheduleId, userId, countryISO, createdAt, status } = appointment.properties;

        const producer = KafkaService.instance.getProducer();
        const topic = env.KAFKA_TOPIC_UPDATE_STATUS

        await producer.send({
            topic, messages: [{
                key: appointmentId?.toString() + Math.random().toString(),
                value: JSON.stringify({
                    appointmentId,
                    scheduleId,
                    userId,
                    countryISO,
                    createdAt,
                    status
                })
            }]
        })
    }

    private async saveEventBrokerError(appointment: Appointment): Promise<void> {
        const { appointmentId, scheduleId, userId, countryISO, createdAt, status } = appointment.properties;

        const producer = KafkaService.instance.getProducer();
        const topic = env.KAFKA_TOPIC_DLQ

        await producer.send({
            topic, messages: [{
                key: appointmentId?.toString() + Math.random().toString(),
                value: JSON.stringify({
                    appointmentId,
                    scheduleId,
                    userId,
                    countryISO,
                    createdAt,
                    status
                })
            }]
        })
    }
}