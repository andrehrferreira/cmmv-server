import { Singleton } from '../abstracts/singleton.abstract';
type TelemetryRecord = {
    id: string;
    label: string;
    startTime: number;
    endTime?: number;
};
export declare class Telemetry extends Singleton {
    private records;
    plugins: any[];
    static registerPlugin(plugin: any): void;
    static start(label: string, requestId?: string): void;
    static end(label: string, requestId?: string): void;
    static getTelemetry(requestId?: string): TelemetryRecord[] | null;
    static clearTelemetry(requestId?: string): boolean;
    static getRecords(): Map<string, TelemetryRecord[]>;
    static generateId(): string;
    static table(requestId?: string): void;
}
export {};
