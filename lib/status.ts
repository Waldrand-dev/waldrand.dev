export type MonitorState = "operational" | "degraded" | "offline";

export interface StatusLatest {
  endpointId: string;
  state: MonitorState;
  httpStatus: number | null;
  checkedAt: string;
}

export interface StatusHistoryPoint {
  endpointId: string;
  state: MonitorState;
  checkedAt: string;
}

export interface StatusResponse {
  checkedAt: string | null;
  latest: StatusLatest[];
  history: StatusHistoryPoint[];
}