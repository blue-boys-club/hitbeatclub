import { Badge } from "@/components/ui/Badge";

interface ArtistStatRowProps {
	artistStats: Array<{
		label: string;
		value: string;
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
					className="text-black text-center font-bold text-[16px] leading-[16px] py-1 w-full"
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
					className="text-black text-center font-bold text-[16px] leading-[16px] py-1"
				>
					{stat.value}
				</Badge>
			))}
		</div>
	</div>
);
export default ArtistStatRow;
