"use client";

import { SquareDropdown, TagDropdown } from "@/components/ui";
import { SortEnum } from "../types/searchParsers";
import { useSearchParametersStates } from "../hooks/useSearchParameters";
import { SearchTag } from "@/components/ui/SearchTag";
import { useTagSearchQueryOptions } from "../hooks/useSearchQuery";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/common/utils";
import { SearchTagButton } from "./SearchTagButton";

const categoryOptions = [
	{
		label: "Category 1",
		value: "category-1",
	},
	{
		label: "Category 2",
		value: "category-2",
	},
];

const genreOptions = [
	{
		label: "Genre 1",
		value: "genre-1",
	},
	{
		label: "Genre 2",
		value: "genre-2",
	},
];

const keyOptions = [
	{
		label: "Key 1",
		value: "key-1",
	},
	{
		label: "Key 2",
		value: "key-2",
	},
];

const bpmOptions = [
	{
		label: "BPM 1",
		value: "bpm-1",
	},
	{
		label: "BPM 2",
		value: "bpm-2",
	},
];

const sortOptions = [
	{
		label: "Recent",
		value: SortEnum.Recent,
	},
	{
		label: "Popular",
		value: SortEnum.Popular,
	},
	{
		label: "A-Z",
		value: SortEnum.A_Z,
	},
];

export const SearchFilters = () => {
	const [{ sort, tags, category, genre, key, bpm }, setSearchParameters] = useSearchParametersStates();
	const [tagSearch, setTagSearch] = useState("");
	const { data: tagsData } = useQuery({
		...useTagSearchQueryOptions(tagSearch),
		placeholderData: (previousData) => (tagSearch ? previousData : []),
	});

	const handleSortChange = (value: SortEnum) => {
		setSearchParameters({ sort: value });
	};

	const handleSelectCategory = (value: string) => {
		setSearchParameters({ category: value });
	};

	const handleSelectGenre = (value: string) => {
		setSearchParameters({ genre: value });
	};

	const handleSelectKey = (value: string) => {
		setSearchParameters({ key: value });
	};

	const handleSelectBPM = (value: string) => {
		setSearchParameters({ bpm: value });
	};

	const handleTagAdd = (value: string) => {
		const oldTags = tags ?? [];
		const newTags = [...new Set([...oldTags, value])];
		setSearchParameters({ tags: newTags });

		setTagSearch("");
	};

	const handleTagRemove = (value: string) => {
		const oldTags = tags ?? [];
		const newTags = oldTags.filter((tag) => tag !== value);
		setSearchParameters({ tags: newTags });
	};

	return (
		<div className="inline-flex flex-col items-start self-stretch justify-start gap-1">
			<div className="inline-flex items-center self-stretch justify-between h-7">
				<div className="flex items-center justify-start gap-1">
					{category ? (
						<SearchTagButton
							isActive
							key={category}
							name={category}
							onClick={() => handleSelectCategory("")}
						/>
					) : (
						<TagDropdown
							trigger={<span className="font-normal font-suisse text-16px leading-16px">{"Category"}</span>}
							onSelect={(value) => handleSelectCategory(value)}
							options={categoryOptions}
							optionsClassName="top-30px"
						/>
					)}
					{genre ? (
						<SearchTagButton
							isActive
							key={genre}
							name={genre}
							onClick={() => handleSelectGenre("")}
						/>
					) : (
						<TagDropdown
							trigger={<span className="font-normal font-suisse text-16px leading-16px">{"Genre"}</span>}
							onSelect={(value) => handleSelectGenre(value)}
							options={genreOptions}
							optionsClassName="top-30px"
						/>
					)}
					{key ? (
						<SearchTagButton
							isActive
							key={key}
							name={key}
							onClick={() => handleSelectKey("")}
						/>
					) : (
						<TagDropdown
							trigger={<span className="font-normal font-suisse text-16px leading-16px">{"Key"}</span>}
							onSelect={(value) => handleSelectKey(value)}
							options={keyOptions}
							optionsClassName="top-30px"
						/>
					)}
					{bpm ? (
						<SearchTagButton
							isActive
							key={bpm}
							name={bpm}
							onClick={() => handleSelectBPM("")}
						/>
					) : (
						<TagDropdown
							trigger={<span className="font-normal font-suisse text-16px leading-16px">{"BPM"}</span>}
							onSelect={(value) => handleSelectBPM(value)}
							options={bpmOptions}
							optionsClassName="top-30px"
						/>
					)}
				</div>
				<div className="flex items-center justify-start gap-3 bg-white">
					<SquareDropdown
						value={sort}
						optionsClassName="border-2 border-black"
						onChange={(value) => handleSortChange(value as SortEnum)}
						options={sortOptions}
					/>
				</div>
			</div>
			<div className="inline-flex items-center self-stretch justify-start h-6 gap-4">
				<TagDropdown
					optionsClassName={cn("top-28px", tagsData?.length === 0 && "hidden")}
					options={
						tagsData?.map((tag) => ({
							label: tag.name,
							value: tag.name,
						})) ?? []
					}
					showChevron={false}
					onSelect={(value) => handleTagAdd(value)}
				>
					<SearchTag
						value={tagSearch}
						placeholder="Search Tags..."
						onChange={(event) => setTagSearch(event.target.value)}
					/>
				</TagDropdown>
				<div className="flex items-center justify-start gap-1">
					<div className="flex justify-start items-center gap-1.5">
						{tags?.map((tag, index) => (
							<SearchTagButton
								key={tag}
								name={tag}
								onClick={() => handleTagRemove(tag)}
								// TODO: Correct this
								isActive={index === tags.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
