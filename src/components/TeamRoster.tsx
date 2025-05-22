
import { useState } from 'react';
import PlayerCard from './PlayerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  battingAverage?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

interface TeamRosterProps {
  teamName: string;
  players: Player[];
  onPlayerSelect?: (playerId: string) => void;
  onAddPlayer?: (playerName: string, playerNumber: string, position: string) => void;
}

const TeamRoster = ({
  teamName,
  players,
  onPlayerSelect,
  onAddPlayer
}: TeamRosterProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('');
  
  const handleAddPlayer = () => {
    if (newPlayerName && newPlayerNumber && newPlayerPosition && onAddPlayer) {
      onAddPlayer(newPlayerName, newPlayerNumber, newPlayerPosition);
      setNewPlayerName('');
      setNewPlayerNumber('');
      setNewPlayerPosition('');
      setShowAddForm(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-baseball-navy text-lg">{teamName} Roster</h3>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Player'}
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-3 bg-baseball-lightGray rounded-lg space-y-3">
          <Input
            placeholder="Player Name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Number"
              value={newPlayerNumber}
              onChange={(e) => setNewPlayerNumber(e.target.value)}
            />
            <Input
              placeholder="Position"
              value={newPlayerPosition}
              onChange={(e) => setNewPlayerPosition(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-baseball-green hover:bg-baseball-green/90"
            onClick={handleAddPlayer}
          >
            Add to Roster
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              number={player.number}
              position={player.position}
              battingAverage={player.battingAverage}
              stats={player.stats}
              onClick={() => onPlayerSelect && onPlayerSelect(player.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TeamRoster;
