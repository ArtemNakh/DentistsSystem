export enum TokenType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface IToken {
  id: number;
  email: string;
  token: string;
  type: TokenType;
  expiresIn: Date;
  createdAt: Date;
}
