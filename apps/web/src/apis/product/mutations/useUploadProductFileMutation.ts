import { uploadProductFile } from "@/apis/product/product.api";
import { MUTATION_KEYS } from "@/apis/mutation-keys";
import { useMutation } from "@tanstack/react-query";
import { PRODUCT_FILE_TYPE } from "../product.type";

export const useUploadProductFileMutation = () => {
	return useMutation({
		mutationKey: MUTATION_KEYS.product.uploadFile,
		mutationFn: ({ file, type }: { file: File; type: PRODUCT_FILE_TYPE }) => uploadProductFile(file, type),
	});
};
