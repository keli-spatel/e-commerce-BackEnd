import { Injectable } from "@nestjs/common";
import { UserLoader } from "src/modules/user/user.dataLoader";

/// DataLoader registry for register the dataLoaders
@Injectable()
export class DataLoadersRegistry {
    private loaders: Record<string, any>;

    constructor(private readonly userLoader: UserLoader) {
        this.loaders = {
            userLoader: this.userLoader.createLoader()
        };
    }

    getDataLoaders(name: string) {

        if (!this.loaders[name]) {
            throw new Error(`Loader ${name} not found`);
        }
        return this.loaders[name];
    }
}