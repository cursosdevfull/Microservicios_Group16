import { KafkaService } from "@core/services/kafka.service";
import { AppointmentPort } from "../ports/appointment.port";
import { Appointment, APPOINTMENT_STATUS } from "./appointment";
import { env } from '../../../env';

export class AppointmentApplication {
    constructor(private port: AppointmentPort) { }

    async subscribe() {
        const consumer = KafkaService.instance.getConsumer();
        consumer.subscribe({
            topics: [env.KAFKA_TOPIC_PE],
            fromBeginning: true
        })

        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("Received message:", message.value!.toString())
                console.log("Topic:", topic, "Partition:", partition);
                const props = JSON.parse(message.value!.toString())
                const appointment = new Appointment(props);
                appointment.updateStatus(APPOINTMENT_STATUS.CONFIRMED);
                await this.port.save(appointment);
            }
        })
    }
}