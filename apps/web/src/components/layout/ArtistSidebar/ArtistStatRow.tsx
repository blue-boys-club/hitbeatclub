import { Badge } from "@/components/ui/Badge";

interface ArtistStatRowProps {
	artistStats: Array<{
		label: string;
		value: number | undefined;
	}>;
}
const ArtistStatRow = ({ artistStats }: ArtistStatRowProps) => (
	<div className="flex px-15">
		<div className="flex flex-col items-end">
			{artistStats.map((stat) => (
				<Badge
					key={stat.label}
					variant="outline"
					outline
					rounded
					size="sm"
					className="w-full font-bold text-center text-hbc-black text-16px leading-16px"
				>
					{stat.label}
				</Badge>
			))}
		</div>
		<div className="flex flex-col items-start">
			{artistStats.map((stat) => (
				<Badge
					key={stat.label}
					variant="outline"
					outline
					size="sm"
					className="font-bold text-center text-hbc-black text-16px leading-16px"
				>
					{stat.value}
				</Badge>
			))}
		</div>
	</div>
);
export default ArtistStatRow;
