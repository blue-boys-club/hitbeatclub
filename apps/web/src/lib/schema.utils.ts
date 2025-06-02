import { ZodArray, ZodDefault, ZodNullable, ZodObject, ZodOptional, ZodTypeAny, z } from "zod";

type DeepRemoveDefault<I extends ZodTypeAny> =
	I extends ZodDefault<infer T>
		? T
		: I extends ZodObject<infer T, infer U, infer C, infer O, infer I>
			? ZodObject<{ [P in keyof T]: DeepRemoveDefault<T[P]> }, U, C, O, I>
			: I extends ZodArray<infer T, infer C>
				? ZodArray<DeepRemoveDefault<T>, C>
				: I extends ZodOptional<infer T>
					? ZodOptional<DeepRemoveDefault<T>>
					: I extends ZodNullable<infer T>
						? ZodNullable<DeepRemoveDefault<T>>
						: I;

export function deepRemoveDefaults<I extends ZodTypeAny>(schema: I): DeepRemoveDefault<I> {
	if (schema instanceof z.ZodDefault) return deepRemoveDefaults(schema.removeDefault());

	if (schema instanceof z.ZodObject) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const newShape: any = {};

		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key];
			newShape[key] = deepRemoveDefaults(fieldSchema);
		}
		return new z.ZodObject({
			...schema._def,
			shape: () => newShape,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any;
	}

	if (schema instanceof z.ZodArray)
		return z.ZodArray.create(deepRemoveDefaults(schema.element)) as DeepRemoveDefault<I>;

	if (schema instanceof z.ZodOptional)
		return z.ZodOptional.create(deepRemoveDefaults(schema.unwrap())) as DeepRemoveDefault<I>;

	if (schema instanceof z.ZodNullable)
		return z.ZodNullable.create(deepRemoveDefaults(schema.unwrap())) as DeepRemoveDefault<I>;

	return schema as DeepRemoveDefault<I>;
}
