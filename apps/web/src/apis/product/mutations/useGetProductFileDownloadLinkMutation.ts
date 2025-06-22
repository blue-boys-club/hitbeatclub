import { useMutation } from "@tanstack/react-query";
import { getProductFileDownloadLink } from "../product.api";
import { PRODUCT_FILE_TYPE } from "../product.type";
import { FileUploadResponse } from "@hitbeatclub/shared-types/file";
import { CommonResponse } from "@/apis/api.type";
import { MUTATION_KEYS } from "@/apis/mutation-keys";

export const useGetProductFileDownloadLinkMutation = () => {
	return useMutation<CommonResponse<FileUploadResponse>, Error, { productId: number; type: PRODUCT_FILE_TYPE }>({
		mutationKey: MUTATION_KEYS.product.getFileDownloadLink,
		mutationFn: ({ productId, type }) => getProductFileDownloadLink(productId, type),
	});
};
