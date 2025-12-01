import type { Language } from "./language.const";

export const MetadataMsgType = {
  CHANGE_LANGUAGE: 'change-language',
  FONT_CHANGE : 'change-font',
  TOGGLE_INTELLISENSE: 'toggle-intellisense',
} as const;

export type MetadataMsgTypes = typeof MetadataMsgType[keyof typeof MetadataMsgType];

export interface ActiveSessionMetadata {
  language: Language;
  fontSize : number;
  intelliSense : boolean;
  isRunning : boolean;
  consoleMessage : string;
}

export interface MetadataMessage {
  type: MetadataMsgTypes;
  payload: Partial<ActiveSessionMetadata>
}

export const RunCodeMsgTypes = {
  RUNNING_CODE: 'running-code',
  RESULT_UPDATED : 'result-updated'
} as const;

export type RunCodeMsgTypes = typeof RunCodeMsgTypes[keyof typeof RunCodeMsgTypes];

export interface ActiveSessionRunCodeData {
  isRunning : boolean;
  consoleMessage : string;
}

export interface RunCodeMessage {
  type : RunCodeMsgTypes;
  payload : Partial<ActiveSessionRunCodeData>;
}

// -----------------------------------------

export interface ChatMessage {
  id: string; 
  userId: string;
  username: string;
  firstName : string;
  avatar : string;
  content: string; 
  timestamp: number;
}

export const ChatMsgEvents = {
  CLIENT_SEND_MESSAGE: 'send-chat-message', // Client-to-Server
  SERVER_NEW_MESSAGE: 'new-chat-message',   // Server-to-Client
} as const;