import { queryOptions } from "@tanstack/react-query";
import { getCartList } from "../cart.api";
import { QUERY_KEYS } from "@/apis/query-keys";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";

export const useCartListQueryOptions = () => {
	const userId = useAuthStore(useShallow((state) => state.user?.userId));
	return queryOptions({
		queryKey: QUERY_KEYS.cart.list,
		queryFn: getCartList,
		enabled: !!userId,
		select: (data) => data.data,
	});
};
