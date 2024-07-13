import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import { CommonSuccessResponce, PaginationDTO } from "src/common/common";
import { CategoryDTO } from "./DTO/category.dto";
import { UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { UpdateCategoryDTO } from "./DTO/partialType/updateCategory.partialType";
import { Category } from "./schema/category.schema";

@Resolver(() => Category)
export class CategoryResolver {
    constructor(
        private categoryService: CategoryService
    ) {}
    
    /// Get all categories
    @Query(() => [ Category ])
    @UseGuards(AccessTokenGuard)
    async getAllCategories(@Args() paginationDTO: PaginationDTO): Promise<Category[]> {
        return this.categoryService.getAllCategories(paginationDTO);
    }

    /// count categories document
    @Query(() => Number)
    @UseGuards(AccessTokenGuard)
    async countCategories(): Promise<number> {
        return this.categoryService.countCategories();
    }

    @Query(() => Number)
    @UseGuards(AccessTokenGuard)
  async productCountInCategory(@Args('categoryId') categoryId: string): Promise<number> {
    return this.categoryService.countProductsInCategory(categoryId);
  }

    /// Get category by id 
    @Query(() => Category)
    @UseGuards(AccessTokenGuard)
    async getCategoryById(@Args('categoryId') categoryId: string): Promise<Category> {
        return this.categoryService.getCategoryById(categoryId);
    }

    /// Add Category
    @Mutation(() => CommonSuccessResponce)
    @UseGuards(AccessTokenGuard)
    async addCategory(@Args('addCategoryDTO') categoryDTO: CategoryDTO): Promise<CommonSuccessResponce> {
        const addCategoryResponse = await this.categoryService.addCategory(categoryDTO);
        return {
            code: addCategoryResponse.code,
            message: addCategoryResponse.message
        }
    }

    /// Update category
    @Mutation(() => CommonSuccessResponce)
    @UseGuards(AccessTokenGuard)
    async updateCategory(
        @Args('categoryId') categoryId: string,
        @Args('updateCategoryDTO') updateCategoryDTO: UpdateCategoryDTO
    ): Promise<CommonSuccessResponce> {
        const updatedCategoryResponse = await this.categoryService.updateCategory(categoryId,updateCategoryDTO);
        return {
            code: updatedCategoryResponse.code,
            message: updatedCategoryResponse.message
        }
    }

    /// Delete cateogry
    @Mutation(() => CommonSuccessResponce)
    @UseGuards(AccessTokenGuard)
    async deleteCategory(@Args('categoryId') categoryId: string): Promise<CommonSuccessResponce> {
        const deletedCategoryResponse = await this.categoryService.deleteCategory(categoryId);
        return {
            code: deletedCategoryResponse.code,
            message: deletedCategoryResponse.message
        }
    }
}