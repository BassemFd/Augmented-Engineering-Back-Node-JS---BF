export type HttpRequest = {
  method: string;
  path: string;
  body: unknown;
};

export type HttpResponse = {
  statusCode: number;
  body: unknown;
};
