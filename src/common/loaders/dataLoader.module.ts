import { DynamicModule, Global, Module, Type } from "@nestjs/common";
import { DataLoadersRegistry } from "./dataLoader.registry";
import { DataLoaderFactory } from "./dataloader.factory";

@Global()
@Module({})
export class DataLoaderModule {
    static forRoot(options: {
        loaders: any[],
        modules: Type<any>[]
    }): DynamicModule {
        return {
            module: DataLoaderModule,
            imports: [
                ...options.modules
            ],
            providers: [
                ...options.loaders,   
                DataLoadersRegistry,
                DataLoaderFactory,
            ],
            exports: [
                DataLoadersRegistry, 
                DataLoaderFactory,
            ]
        }
    }
}