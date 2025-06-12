import { DynamicModule, ForwardReference, Module, Type } from "@nestjs/common";
import { RoutesUserModule } from "src/router/routes/routes.user.module";
import { RoutesPublicModule } from "src/router/routes/routes.public.module";

@Module({})
export class RouterModule {
	static forRoot(): DynamicModule {
		const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];

		if (process.env.HTTP_ENABLE === "true") {
			imports.push(RoutesPublicModule, RoutesUserModule);
		}

		return {
			module: RouterModule,
			providers: [],
			exports: [],
			controllers: [],
			imports,
		};
	}
}
