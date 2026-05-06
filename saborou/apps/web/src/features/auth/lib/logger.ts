import type { AuthEvent, AuthLogEntry } from "./types";

export function logAuthEvent(
  event: AuthEvent,
  level: AuthLogEntry["level"],
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  const entry: AuthLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    userId,
    metadata,
  };

  switch (level) {
    case "error":
      console.error(JSON.stringify(entry));
      break;
    case "warn":
      console.warn(JSON.stringify(entry));
      break;
    case "debug":
      console.debug(JSON.stringify(entry));
      break;
    default:
      console.log(JSON.stringify(entry));
  }
}
