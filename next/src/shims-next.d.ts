declare module 'next/server' {
  export interface NextRequest extends Request {
    nextUrl: URL;
  }
  export interface NextFetchEvent {
    respondWith: (r: Response | Promise<Response>) => void;
  }
  export type NextMiddleware = (req: NextRequest, ev: NextFetchEvent) => Response | Promise<Response>;
  export const NextResponse: any;
}
