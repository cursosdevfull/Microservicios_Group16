import { Appointment } from "../application/appointment"

export type AppointmentPort = {
    save(appointment: Appointment): Promise<Appointment>
    update(appointment: Appointment): Promise<Appointment>
}