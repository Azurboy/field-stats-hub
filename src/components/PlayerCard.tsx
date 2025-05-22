
import { Card } from '@/components/ui/card';

interface PlayerCardProps {
  name: string;
  number: string;
  position: string;
  battingAverage?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  onClick?: () => void;
}

const PlayerCard = ({
  name,
  number,
  position,
  battingAverage,
  stats,
  onClick
}: PlayerCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="bg-baseball-navy text-white p-3 flex items-center justify-between">
        <div className="font-medium">{name}</div>
        <div className="bg-white text-baseball-navy rounded-full w-8 h-8 flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-500">{position}</div>
          {battingAverage && (
            <div className="text-sm font-semibold">{battingAverage} AVG</div>
          )}
        </div>
        
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PlayerCard;
