export enum TokenType {
  VERIFICATION,
  PASSWORD_RESET,
}



export interface IToken {
  id: number;
  email: string;
  token: string;
  type: TokenType;
  expiresIn: Date;
  createdAt: Date;
}
