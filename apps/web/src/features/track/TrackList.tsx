import React, { memo } from "react";
import { TrackFilters } from "./TrackFilters";
import { TrackSort } from "./TrackSort";
import { TrackSearch } from "./TrackSearch";
import { TrackItem } from "./TrackItem";

interface TrackListProps {
	tracks: number[]; //Temp
	onFiltersChange?: () => void;
	onSortChange?: () => void;
	onSearch?: (query: string) => void;
}

export const TrackList = memo(({ onFiltersChange, onSortChange, onSearch, tracks }: TrackListProps) => {
	return (
		<>
			<div className="mb-3">
				<div className="flex justify-between items-center w-full">
					<TrackFilters onFiltersChange={onFiltersChange} />
					<TrackSort onSortChange={onSortChange} />
				</div>
				<TrackSearch onSearch={onSearch} />
			</div>

			<div className="flex flex-col gap-2.5 mb-3">
				{tracks.map((track, index) => (
					<TrackItem key={index} />
				))}
			</div>
		</>
	);
});

TrackList.displayName = "TrackList";
