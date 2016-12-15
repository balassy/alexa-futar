declare module 'request-promise-lite' {

  namespace RequestPromiseLite {
    interface IResponse {
      statusCode: number;
      body: any;
    }

    interface IRequestPromise<TResponse> {
      then<TResponse>(onfulfilled?: (value: any) => TResponse | PromiseLike<TResponse>, onrejected?: (reason: any) => void): Promise<TResponse>;
    }

    export interface IOptions {
      json: boolean;
      resolveWithFullResponse: boolean;
    }

    export interface IRequestPromiseLiteStatic {
      get(url: string, options: IOptions): IRequestPromise<IResponse>;
    }
  }

  const requestPromiseLite: RequestPromiseLite.IRequestPromiseLiteStatic;
  export = requestPromiseLite;
}
