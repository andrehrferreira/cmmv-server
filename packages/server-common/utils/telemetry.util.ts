import { Singleton } from '../abstracts/singleton.abstract';

type TelemetryRecord = {
    id: string;
    label: string;
    startTime: number;
    endTime?: number;
};

export class Telemetry extends Singleton {
    private records: Map<string, TelemetryRecord[]> = new Map();
    public plugins: any[] = [];

    public static registerPlugin(plugin: any): void {
        const telemetry = Telemetry.getInstance();
        telemetry.plugins.push(plugin);
    }

    public static start(label: string, requestId?: string): void {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();

            if (!telemetry.records.has(requestId))
                telemetry.records.set(requestId, []);

            telemetry.records.get(requestId)?.push({
                id: Telemetry.generateId(),
                label,
                startTime: Date.now(),
            });
        }
    }

    public static end(label: string, requestId?: string): void {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            const record = telemetry.records
                .get(requestId)
                ?.find(r => r.label === label && !r.endTime);

            if (record) record.endTime = Date.now();
        }
    }

    public static getTelemetry(requestId?: string): TelemetryRecord[] | null {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            return telemetry.records.get(requestId) || null;
        } else {
            return null;
        }
    }

    public static clearTelemetry(requestId?: string): boolean {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();

            if (telemetry.records.has(requestId))
                return telemetry.records.delete(requestId);
        }

        return false;
    }

    public static getRecords() {
        return Telemetry.getInstance().records;
    }

    public static generateId(): string {
        return (Math.random() + 1).toString(36).substring(7);
    }

    public static table(requestId?: string) {
        if (process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            const serverMetric = telemetry.records.get(requestId);

            let metrics = {};

            if (serverMetric?.length > 0) {
                serverMetric.forEach(item => {
                    metrics[item.label] = {
                        start: item.startTime,
                        end: item.endTime || Date.now(),
                        duration: (item.endTime || Date.now()) - item.startTime,
                    };
                });
            }

            metrics = { ...metrics };

            let totalDuration = 0;
            const summary = Object.keys(metrics).map(key => {
                const duration = metrics[key].duration;
                totalDuration += duration;
                return {
                    Process: key,
                    Duration: `${duration.toFixed(2)} ms`,
                };
            });

            console.table(summary);
        }
    }
}
