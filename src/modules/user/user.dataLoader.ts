import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { UserService } from "./user.service";
import { User } from "./schema/user.schema";

@Injectable()
export class UserLoader {

    constructor(
        private userSerive: UserService
    ) {}

    createLoader(): DataLoader<string,User | Error> {
        return new DataLoader<string,User | Error>(async (ids: readonly string[]) => {
            const users = await this.userSerive.userByIdForDataLoader(ids as string[]);
            const userMap = new Map(users.map(userData => [ userData._id.toString(), userData ]));
            return ids.map(id => userMap.get(id) || new Error(`User with id ${id} not found`));
        }) 
    }
}