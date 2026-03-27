import client from "prom-client";
import { store } from "../store/store";

const registry = new client.Registry();

client.collectDefaultMetrics({ register: registry });

const roomsGauge = new client.Gauge({
  name: "hitscord_media_rooms",
  help: "Number of active rooms",
  registers: [registry],
  collect() {
    this.set(Object.keys(store.rooms).length);
  },
});

const peersGauge = new client.Gauge({
  name: "hitscord_media_peers",
  help: "Number of connected peers",
  registers: [registry],
  collect() {
    this.set(Object.keys(store.peers).length);
  },
});

const transportsGauge = new client.Gauge({
  name: "hitscord_media_transports",
  help: "Number of WebRTC transports",
  registers: [registry],
  collect() {
    this.set(store.transports.length);
  },
});

const producersGauge = new client.Gauge({
  name: "hitscord_media_producers",
  help: "Number of producers",
  registers: [registry],
  collect() {
    this.set(store.producers.length);
  },
});

const consumersGauge = new client.Gauge({
  name: "hitscord_media_consumers",
  help: "Number of consumers",
  registers: [registry],
  collect() {
    this.set(store.consumers.length);
  },
});

const serversGauge = new client.Gauge({
  name: "hitscord_media_servers",
  help: "Number of servers with users",
  registers: [registry],
  collect() {
    this.set(Object.keys(store.serversUser).length);
  },
});

const activeConnectionsGauge = new client.Gauge({
  name: "hitscord_media_active_connections",
  help: "Number of active socket connections",
  registers: [registry],
});

export const setActiveConnections = (count: number) => {
  activeConnectionsGauge.set(count);
};

export const getMetrics = async () => registry.metrics();

export const metricsContentType = registry.contentType;

// Ensure gauges are referenced so they are registered
export const metricsGauges = {
  roomsGauge,
  peersGauge,
  transportsGauge,
  producersGauge,
  consumersGauge,
  serversGauge,
  activeConnectionsGauge,
};
