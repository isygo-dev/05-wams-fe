// types.ts
export type GrammarErrorType = 'spelling' | 'grammar' | 'conjugation';
export type GrammarErrorSeverity = 'error' | 'warning' | 'suggestion';

export interface GrammarError {
  offset: number;
  length: number;
  message: string;
  type: GrammarErrorType;
  suggestions: string[];
  severity: GrammarErrorSeverity;
  context?: string;
  ruleId?: string;
  ruleDescription?: string;
}

export interface LanguageToolResponse {
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    premium: boolean;
    status: string;
  };
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
      confidence: number;
    };
  };
  matches: Array<{
    message: string;
    shortMessage?: string;
    replacements: Array<{ value: string }>;
    offset: number;
    length: number;
    context: {
      text: string;
      offset: number;
      length: number;
    };
    sentence: string;
    rule: {
      id: string;
      description: string;
      issueType: string;
      category: {
        id: string;
        name: string;
      };
    };
  }>;
}
export interface LanguageToolMatch {
  offset: number;
  length: number;
  message: string;
  shortMessage?: string;
  replacements?: Array<{ value: string }>;
  context?: {
    text: string;
    offset: number;
    length: number;
  };
  rule?: {
    id: string;
    description?: string;
    issueType?: string;
    category?: {
      id: string;
      name?: string;
    };
  };
}
