import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { UpdateRefreshTokenDTO } from "./DTO/partialType/refreshToken.partialType";
import { City, State } from "country-state-city";
import { UpdateUserDTO } from "./DTO/partialType/updateUser.partialType";
import { Http400Exception, Http404Exception } from "src/common/exception/custom.exception";
import { PaginationDTO } from "src/common/common";

@Injectable()
export class UserService {
    find(arg0: {}) {
        throw new Error("Method not implemented.");
    }
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}
 
    /// Get all users service
    async getAllUsers(paginationDTO: PaginationDTO = { skip: 0, take: 5 }) : Promise<User[]> {
        try {
            const users: User[] = await this.userModel.find(
                null, null, {
                    limit: paginationDTO.take,
                    skip: paginationDTO.skip
                }
            ).lean().exec();
            
            return users;
        } catch (error) {
            throw new Http400Exception('Failed to retrieve users.');
        }
    }

    /// count users document service
    async countUsers(): Promise<number> {
        try {
            const numberOfUsers: number = await this.userModel.countDocuments().lean().exec();
            return numberOfUsers; 
        } catch (error) {
            throw new Http400Exception('Failed to count users.')
        }
    }

    /// Get user by id service
    async getUserById(userId: string) : Promise<User> {
        try {
            const user: User = await this.userModel.findById(userId).lean().exec();
            return user;
        } catch (error) {
            throw new Http400Exception('Failed to retrieve users.');
        }
    }
    /// Get user by phone number service
    async getUserByPhoneNumber(phoneNumber: number): Promise<User> {
        try {
            const user: User = await this.userModel.findOne({ phoneNumber }).lean().exec();
            return user;
        } catch (error) {
            throw new Http404Exception('Failed to retrieve user.');
        }
    }

    /// update only refresh token using partialType service
    async updateRefreshTokenInDb(userId: string, updateRefreshTokenDTO: UpdateRefreshTokenDTO) : Promise<User> {
        try {
            const updatedUser: User = await this.userModel.findByIdAndUpdate(userId, updateRefreshTokenDTO, { new: true }).lean().exec();
            return updatedUser;
        } catch (error) {
            throw new Http400Exception("Failed to update refresh token.");
        }
    }

    /// update only email and userName using partialType service
    async updateUserDetails(userId: string, updateUserDTO: UpdateUserDTO) : Promise<User> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDTO, { new: true }).lean().exec();
            return updatedUser
        } catch (error) {
            throw new Http400Exception("Failed to update user details.");
        }
    }
    /// Get All indian state list serivce
    async getAllStates(): Promise<any> {
       try {
         const stateDetail = State.getStatesOfCountry("IN");
 
         const newStateDetail = stateDetail.map(state => ({
             ...state,
             stateCode: state.isoCode,
         }));
 
         return newStateDetail;
       } catch (error) {
            throw new Http400Exception("Failed to load states.");
        }
    }

    /// Get selected state cities list service
    async getAllCitiesByState(stateCode: string): Promise<any> {
        try {
            const cities = City.getCitiesOfState("IN", stateCode);
            if (!cities || cities.length === 0) {
                throw new Http404Exception('No cities found for the provided state code.');
            }

            return cities;
        } catch (error) {
            if ((error instanceof Http404Exception)) {
                throw error;
            }
            throw new Http400Exception("Failed to load cities.");
        }
    }

    /// for the dataLoader testing
    async userByIdForDataLoader(userId: string[]): Promise<User[]> {
        const data = this.userModel.find({ _id: { $in: userId }}).exec();
        console.log('service',data);
        
        return data;
    }

    async bubbleSort(array: User[]): Promise<User[]> {
        const startTime = performance.now();
        const n = array.length;
        let swapped;

        do {
            swapped = false; // Reset swapped for each iteration
            for (let i = 0; i < n - 1; i++) {
              if (array[i].userName > array[i + 1].userName) {  // Sort in ascending order
                const temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swapped = true;
              }
            }
          } while (swapped);

            const endTime = performance.now(); // End time measurement
            const elapsedTime = (endTime - startTime) / 1000; // Time in seconds

            console.log(`Bubble sort took ${elapsedTime} seconds to sort ${n} users.`);

        return array;
    }
    
    async getUsers(): Promise<User[]> {
        return await this.userModel.find({})
    }
}
