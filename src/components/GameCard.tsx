
import { Card } from '@/components/ui/card';

interface GameCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  location?: string;
  status: 'upcoming' | 'in-progress' | 'final';
  onClick?: () => void;
}

const GameCard = ({ 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore, 
  date, 
  location, 
  status,
  onClick 
}: GameCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="bg-baseball-navy text-white p-3 text-xs font-medium flex justify-between items-center">
        <div>{date}</div>
        <div className={`px-2 py-0.5 rounded-full text-xs ${
          status === 'in-progress' 
            ? 'bg-baseball-orange' 
            : status === 'final' 
              ? 'bg-baseball-red' 
              : 'bg-baseball-green'
        }`}>
          {status === 'in-progress' ? 'LIVE' : status.toUpperCase()}
        </div>
      </div>
      
      <div className="p-4">
        {location && (
          <div className="text-xs text-gray-500 mb-2">{location}</div>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <div className="font-medium">{awayTeam}</div>
          <div className="text-xl font-semibold">{awayScore}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="font-medium">{homeTeam}</div>
          <div className="text-xl font-semibold">{homeScore}</div>
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
