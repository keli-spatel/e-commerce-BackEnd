import { Injectable } from "@nestjs/common";
import { DataLoadersRegistry } from "./dataLoader.registry";

/// DataLoader factory is the gatway between DataLoaderInterceptors and DataLoaderRegistry
@Injectable()
export class DataLoaderFactory {
    constructor(private readonly dataLoadersRegistry: DataLoadersRegistry) {}

    getDataLoaders(name: string): any {         

        if (!this.dataLoadersRegistry) {
            throw new Error("DataLoadersRegistry is not initialized");
        }  

        return this.dataLoadersRegistry.getDataLoaders(name);
    }                                                                   
}