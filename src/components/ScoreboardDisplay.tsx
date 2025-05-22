
import { Card } from '@/components/ui/card';

interface ScoreboardDisplayProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  inning: number;
  isBottom: boolean;
  balls: number;
  strikes: number;
  outs: number;
}

const ScoreboardDisplay = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  inning,
  isBottom,
  balls,
  strikes,
  outs
}: ScoreboardDisplayProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-baseball-navy text-white p-3 font-medium text-center">
        SCOREBOARD
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="col-span-2 font-medium">Team</div>
          <div className="text-center font-medium">R</div>
          <div></div>
          
          <div className="col-span-2">{awayTeam}</div>
          <div className="text-center text-xl font-semibold">{awayScore}</div>
          <div></div>
          
          <div className="col-span-2">{homeTeam}</div>
          <div className="text-center text-xl font-semibold">{homeScore}</div>
          <div></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500">INNING</div>
            <div className="font-semibold text-baseball-navy">
              {isBottom ? 'BOT' : 'TOP'} {inning}
            </div>
          </div>
          
          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500">COUNT</div>
            <div className="font-semibold text-baseball-navy">
              {balls}-{strikes}
            </div>
          </div>
          
          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500">OUTS</div>
            <div className="font-semibold text-baseball-navy">
              {outs}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {[1, 2, 3].map(base => (
            <div 
              key={base} 
              className={`w-8 h-8 border-2 border-baseball-navy transform rotate-45 ${
                base === 1 ? 'bg-baseball-orange' : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ScoreboardDisplay;
