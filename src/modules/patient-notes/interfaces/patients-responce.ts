export interface INoteRequest extends Request {
  user: {
    email: string;
    userId: number;
  };
}
