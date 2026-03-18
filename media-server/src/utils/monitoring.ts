import { store } from "../store/store";

type ErrorEntry = {
  id: string;
  at: string;
  scope: string;
  message: string;
  stack?: string;
  meta?: Record<string, unknown>;
};

type CounterMap = Record<string, number>;

const MAX_ERRORS = Number(process.env.ERROR_BUFFER_SIZE || 200);
const startedAt = Date.now();
const errorBuffer: ErrorEntry[] = [];
const counters: CounterMap = {};

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: "Unknown error" };
  }
};

export const increment = (name: string, by = 1) => {
  counters[name] = (counters[name] || 0) + by;
};

export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  console.log("level=info", message, meta || "");
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
  console.warn("level=warn", message, meta || "");
};

export const logError = (
  scope: string,
  error: unknown,
  meta?: Record<string, unknown>,
) => {
  const normalized = normalizeError(error);
  const entry: ErrorEntry = {
    id: generateId(),
    at: new Date().toISOString(),
    scope,
    message: normalized.message,
    stack: normalized.stack,
    meta,
  };

  errorBuffer.unshift(entry);
  if (errorBuffer.length > MAX_ERRORS) {
    errorBuffer.pop();
  }

  console.error("level=error", `[${scope}] ${normalized.message}`, meta || "");
  if (normalized.stack) {
    console.error(normalized.stack);
  }
};

export const attachProcessHandlers = () => {
  process.on("unhandledRejection", (reason) => {
    logError("process.unhandledRejection", reason);
  });

  process.on("uncaughtException", (error) => {
    logError("process.uncaughtException", error);
  });
};

const summarizeRooms = () => {
  return Object.entries(store.rooms).map(([roomName, room]) => {
    const peerCount = room.peers.length;
    const producerCount = store.producers.filter(
      (producer) => producer.roomName === roomName,
    ).length;
    const consumerCount = store.consumers.filter(
      (consumer) => consumer.roomName === roomName,
    ).length;

    return {
      roomName,
      serverId: room.serverId,
      peerCount,
      producerCount,
      consumerCount,
    };
  });
};

const summarizeServers = () => {
  return Object.entries(store.serversUser).map(([serverId, data]) => {
    const roomCounts: Record<string, number> = {};
    data.users.forEach((user) => {
      if (!user.roomName) return;
      roomCounts[user.roomName] = (roomCounts[user.roomName] || 0) + 1;
    });

    return {
      serverId,
      users: data.users,
      roomUserCounts: roomCounts,
      roomNames: store.servers[serverId]?.roomNames || [],
    };
  });
};

export const getAdminState = (connectionsCount: number) => {
  return {
    now: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    startedAt: new Date(startedAt).toISOString(),
    connections: {
      active: connectionsCount,
    },
    counts: {
      rooms: Object.keys(store.rooms).length,
      peers: Object.keys(store.peers).length,
      transports: store.transports.length,
      producers: store.producers.length,
      consumers: store.consumers.length,
    },
    counters,
    servers: summarizeServers(),
    rooms: summarizeRooms(),
    recentErrors: errorBuffer,
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
    },
  };
};
