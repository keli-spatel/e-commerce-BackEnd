import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { DataLoaderFactory } from '../loaders/dataloader.factory';

/// Custorm DataLoader interceptor 
@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly dataLoaderFactory: DataLoaderFactory) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    if (!ctx.dataLoaderFactory) {
      ctx.dataLoaderFactory = this.dataLoaderFactory;
    }

    return next.handle();
  }
}
