import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/// Custom DataLoader decorator
export const DataLoaderr = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        
        const ctx = GqlExecutionContext.create(context);
        const dataLoaderFactory = ctx.getContext().dataLoaderFactory;

        if (!dataLoaderFactory) {
          throw new Error('DataLoaderFactory not found in request context');
        }
        
        return data ? dataLoaderFactory.getDataLoaders(data) : dataLoaderFactory;
    }
)                                                       