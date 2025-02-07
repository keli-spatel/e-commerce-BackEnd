import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryResolver } from "./category.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schema/category.schema";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Category.name,
                useFactory: () => CategorySchema
            }
        ])
    ],
    providers: [
        CategoryService,
        CategoryResolver
    ],
    exports: [],
    controllers: []
})
export class CategoryModule {}