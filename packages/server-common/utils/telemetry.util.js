"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telemetry = void 0;
const singleton_abstract_1 = require("../abstracts/singleton.abstract");
class Telemetry extends singleton_abstract_1.Singleton {
    constructor() {
        super(...arguments);
        this.records = new Map();
        this.plugins = [];
    }
    static registerPlugin(plugin) {
        const telemetry = Telemetry.getInstance();
        telemetry.plugins.push(plugin);
    }
    static start(label, requestId) {
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
    static end(label, requestId) {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            const record = telemetry.records
                .get(requestId)
                ?.find(r => r.label === label && !r.endTime);
            if (record)
                record.endTime = Date.now();
        }
    }
    static getTelemetry(requestId) {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            return telemetry.records.get(requestId) || null;
        }
        else {
            return null;
        }
    }
    static clearTelemetry(requestId) {
        if (requestId && process.env.NODE_ENV === 'dev') {
            const telemetry = Telemetry.getInstance();
            if (telemetry.records.has(requestId))
                return telemetry.records.delete(requestId);
        }
        return false;
    }
    static getRecords() {
        return Telemetry.getInstance().records;
    }
    static generateId() {
        return (Math.random() + 1).toString(36).substring(7);
    }
    static table(requestId) {
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
exports.Telemetry = Telemetry;
