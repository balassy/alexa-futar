declare module 'request-promise-lite' {

  namespace RequestPromiseLite {
    interface Response {
      statusCode: number,
      body: any
    }

    interface RequestPromise<TResponse> {
      then<TResponse>(onfulfilled?: (value: any) => TResponse | PromiseLike<TResponse>, onrejected?: (reason: any) => void): Promise<TResponse>;
    } 
    
    export interface Options {
      json: boolean;
      resolveWithFullResponse: boolean;
    }

    export interface RequestPromiseLiteStatic {
      get(url: string, options: Options): RequestPromise<Response>;
    }
  }

  var requestPromiseLite: RequestPromiseLite.RequestPromiseLiteStatic;
  export = requestPromiseLite;      
}