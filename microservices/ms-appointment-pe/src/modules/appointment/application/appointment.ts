export enum COUNTRY_ISO {
    PE = "PE",
    MX = "MX",
    CO = "CO"
}

export enum APPOINTMENT_STATUS {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELED = "canceled"
}

export type AppointmentEssentials = {
    scheduleId: string;
    userId: string;
    countryISO: COUNTRY_ISO;
}

export type AppointmentOptionals = {
    createdAt: Date
    status: APPOINTMENT_STATUS
    appointmentId: string;
}

export type AppointmentProps = AppointmentEssentials & Partial<AppointmentOptionals>;

export class Appointment {
    private readonly appointmentId!: string;
    private scheduleId!: string;
    private userId!: string;
    private countryISO!: COUNTRY_ISO;
    private status!: APPOINTMENT_STATUS;
    private createdAt!: Date;

    constructor(props: AppointmentProps) {
        Object.assign(this, props);

        if (!props.scheduleId) {
            throw new Error("Schedule ID is required");
        }

        if (!props.userId) {
            throw new Error("User ID is required");
        }

        if (!props.countryISO) {
            throw new Error("Country ISO is required");
        }

        if (!props.createdAt) {
            this.createdAt = new Date();
        }

        if (!props.status) {
            this.status = APPOINTMENT_STATUS.PENDING;
        }

        if (!props.appointmentId) {
            this.appointmentId = crypto.randomUUID();
        }

    }

    get properties(): AppointmentProps {
        return {
            appointmentId: this.appointmentId,
            scheduleId: this.scheduleId,
            userId: this.userId,
            countryISO: this.countryISO,
            createdAt: this.createdAt,
            status: this.status
        };
    }

    updateStatus(status: APPOINTMENT_STATUS) {
        this.status = status;
    }
}