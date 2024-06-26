import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by controller
    // console.log('Im running before the handler', context);
    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out to client
        // console.log('Im running before response is sent out', data, this.dto);
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
