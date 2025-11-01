import type { Language } from "./language.const";

export const MetadataMsgType = {
  CHANGE_LANGUAGE: 'change-language',
  LANGUAGE_CHANGED: 'language-changed', 
  FONT_CHANGE : 'change-font',
  FONT_CHANGED : 'font-changed',
  TOGGLE_INTELLISENSE: 'toggle-intellisense',
  INTELLISENSE_TOGGLED: 'intellisense-toggled'
} as const;

export type MetadataMsgTypes = typeof MetadataMsgType[keyof typeof MetadataMsgType];

export interface ActiveSessionMetadata {
  language: Language;
  fontSize : number;
  intelliSense : boolean;
}

export interface MetadataMessage {
  type: MetadataMsgTypes;
  payload: Partial<ActiveSessionMetadata>
}