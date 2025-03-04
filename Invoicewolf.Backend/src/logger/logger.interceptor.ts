import { Client } from '@elastic/elasticsearch';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

const client = new Client({
  node: process.env.LOGS_URL,
  auth: {
    username: process.env.LOGS_USERNAME,
    password: process.env.LOGS_PASSWORD,
  },
});

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const now = Date.now();

    const requestId = Math.floor(Math.random() * 100000000);

    logRequest(req, requestId);

    return next.handle().pipe(
      tap({
        next: () => {
          logResponse(res, Date.now() - now, requestId);
        },
      }),
    );
  }
}

function logRequest(req: Request, requestId: number) {
  client.index({
    index: 'log',
    document: {
      timestamp: new Date(),
      ip: req.ip,
      method: req.method,
      endpoint: req.url,
      trackingId: requestId,
      requestUserId: req['user']?.user_id,
    },
  });
}

function logResponse(res: Response, duration: number, requestId: number) {
  client.index({
    index: 'log',
    document: {
      timestamp: new Date(),
      ip: res.req.ip,
      statusCode: res.statusCode,
      endpoint: res.req.url,
      duration: duration,
      trackingId: requestId,
      requestUserId: res.req['user']?.user_id,
    },
  });
}
