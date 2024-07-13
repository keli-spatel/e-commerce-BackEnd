import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { UpdateUserDTO } from "./DTO/partialType/updateUser.partialType";
import { StateCity } from "./schema/stateCity.type";
import { PaginationDTO } from "src/common/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { DataLoaderr } from "src/common/decorators/dataLoader.decorators";
import { DataLoaderInterceptor } from "src/common/interceptors/dataLoader.interceptor";
import DataLoader from "dataloader";

@Resolver(() => User)
@UseInterceptors(DataLoaderInterceptor)
export class UserResolver {
    constructor(
        private userService: UserService,
    ) { }

    /// for the dataLoader testing
    @Query(() => User)
    async getDataLoaderData(
        @Args('userIds') userIds: string,
        @DataLoaderr('userLoader') userLoader: DataLoader<string,User>
    ) {
       const result = await userLoader.load(userIds);
       return result;
    }

    /// fetch all users
    @Query(() => [User])
    @SkipThrottle()
    @UseGuards(AccessTokenGuard)
    async getAllUsers(@Args() paginationDTO: PaginationDTO): Promise<User[]> {
        return this.userService.getAllUsers(paginationDTO)
    }

    /// count users document
    @Query(() => Number)
    @UseGuards(AccessTokenGuard)
    async countUsers(): Promise<number> {
        return this.userService.countUsers();
    }

    /// fetch user by phoneNumber
    @Query(() => User)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @UseGuards(AccessTokenGuard)
    async getUserByPhoneNumber(@Args('phoneNumber') phoneNumber: number): Promise<User> {
        return this.userService.getUserByPhoneNumber(phoneNumber)
    }

    /// fetch user by id
    @Query(() => User)
    @UseGuards(AccessTokenGuard)
    async getUserById(@Args('userId') userId: string): Promise<User> {
        return this.userService.getUserById(userId)
    }

    /// update user data
    @Mutation(() => User)
    @UseGuards(AccessTokenGuard)
    async updateUserDetails(
        @Args("userId") userId: string,
        @Args("updateUserDTO") updateUserDTO: UpdateUserDTO,
    ): Promise<User> {
        return this.userService.updateUserDetails(userId, updateUserDTO)
    }

    /// fetch indian all states list
    @Query(() => [ StateCity ])
    @UseGuards(AccessTokenGuard)
    async getAllStates(): Promise<any> {
        return this.userService.getAllStates()
    }
   
    /// fetch all cities list by selected state
    @Query(() => [ StateCity ])
    @UseGuards(AccessTokenGuard)
    async getAllCitiesByState(@Args('stateCode') stateCode: string): Promise<any> {
        return this.userService.getAllCitiesByState(stateCode)
    }

    @Query(() => [User], {name:'sortByUserName'})
    @UseGuards(AccessTokenGuard)
    async getSortedUser(): Promise<User[]> {
        const user = await this.userService.getUsers();
        return await this.userService.bubbleSort(user);
    }
}