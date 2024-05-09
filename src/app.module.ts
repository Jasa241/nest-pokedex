import { join } from "path";
import { PokemonModule } from "./pokemon/pokemon.module";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from "@nestjs/config";
import { AppsettingsConfiguration } from "./common/config/appsettings.config";
import { JoiValidationSchema } from "./common/config/joi.validation";


@Module({
    imports: [

        ConfigModule.forRoot({
            load: [AppsettingsConfiguration],
            validationSchema: JoiValidationSchema
        }),

        ServeStaticModule.forRoot({
            rootPath:join(__dirname,'..','public'),
        }),

        MongooseModule.forRoot( process.env.MONGODB, {
            dbName: 'pokemonsDb'
        } ),

        PokemonModule,

        CommonModule,

        SeedModule
    ]
})
export class AppModule {
}