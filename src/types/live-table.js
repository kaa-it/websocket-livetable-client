export const WebsocketStatus  = {
  CONNECTING:  'CONNECTING...',
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE'
}

export interface TableRow {
  id: number;
  text: string;
}

export type LiveTable = Array<TableRow>;

export const LiveTableActionType = {
  DATA: 'data',
  INSERT: 'insert',
  DELETE: 'delete',
  UPDATE: 'update',
  MOVE: 'move',
}
