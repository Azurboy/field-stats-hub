
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamRoster from '@/components/TeamRoster';
import PlayerCard from '@/components/PlayerCard';
import { toast } from 'sonner';

// Sample player data
const sampleTeams = {
  eagles: {
    name: 'Eagles',
    players: [
      {
        id: 'e1',
        name: 'Mike Smith',
        number: '12',
        position: 'Pitcher',
        battingAverage: '.315',
        stats: [
          { label: 'HR', value: 3 },
          { label: 'RBI', value: 17 },
          { label: 'SB', value: 5 }
        ]
      },
      {
        id: 'e2',
        name: 'Jason Johnson',
        number: '24',
        position: 'Catcher',
        battingAverage: '.287',
        stats: [
          { label: 'HR', value: 1 },
          { label: 'RBI', value: 12 },
          { label: 'SB', value: 0 }
        ]
      },
      {
        id: 'e3',
        name: 'Carlos Rodriguez',
        number: '8',
        position: 'Shortstop',
        battingAverage: '.324',
        stats: [
          { label: 'HR', value: 2 },
          { label: 'RBI', value: 14 },
          { label: 'SB', value: 8 }
        ]
      },
      {
        id: 'e4',
        name: 'Jun Kim',
        number: '16',
        position: 'Outfield',
        battingAverage: '.301',
        stats: [
          { label: 'HR', value: 5 },
          { label: 'RBI', value: 22 },
          { label: 'SB', value: 3 }
        ]
      }
    ]
  },
  tigers: {
    name: 'Tigers',
    players: [
      {
        id: 't1',
        name: 'Ryan Thompson',
        number: '5',
        position: '1st Base',
        battingAverage: '.275',
        stats: [
          { label: 'HR', value: 7 },
          { label: 'RBI', value: 28 },
          { label: 'SB', value: 1 }
        ]
      },
      {
        id: 't2',
        name: 'Marcus Davis',
        number: '31',
        position: 'Pitcher',
        battingAverage: '.189',
        stats: [
          { label: 'HR', value: 0 },
          { label: 'RBI', value: 5 },
          { label: 'SB', value: 0 }
        ]
      },
      {
        id: 't3',
        name: 'Kevin Wilson',
        number: '22',
        position: 'Catcher',
        battingAverage: '.263',
        stats: [
          { label: 'HR', value: 2 },
          { label: 'RBI', value: 15 },
          { label: 'SB', value: 0 }
        ]
      },
      {
        id: 't4',
        name: 'Luis Martinez',
        number: '9',
        position: 'Outfield',
        battingAverage: '.310',
        stats: [
          { label: 'HR', value: 4 },
          { label: 'RBI', value: 19 },
          { label: 'SB', value: 11 }
        ]
      }
    ]
  }
};

const Teams = () => {
  const [teams, setTeams] = useState(sampleTeams);
  const [activeTeam, setActiveTeam] = useState('eagles');
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  const handleAddTeam = () => {
    if (newTeamName) {
      const teamKey = newTeamName.toLowerCase().replace(/\s+/g, '-');
      
      setTeams({
        ...teams,
        [teamKey]: {
          name: newTeamName,
          players: []
        }
      });
      
      setActiveTeam(teamKey);
      setNewTeamName('');
      toast.success(`${newTeamName} added`);
    }
  };
  
  const handleAddPlayer = (playerName: string, playerNumber: string, position: string) => {
    const newPlayer = {
      id: `${activeTeam}-${Date.now()}`,
      name: playerName,
      number: playerNumber,
      position: position,
      battingAverage: '.000',
      stats: [
        { label: 'HR', value: 0 },
        { label: 'RBI', value: 0 },
        { label: 'SB', value: 0 }
      ]
    };
    
    setTeams({
      ...teams,
      [activeTeam]: {
        ...teams[activeTeam as keyof typeof teams],
        players: [
          ...teams[activeTeam as keyof typeof teams].players,
          newPlayer
        ]
      }
    });
    
    toast.success(`${playerName} added to roster`);
  };
  
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
  };
  
  const getSelectedPlayer = () => {
    if (!selectedPlayer) return null;
    
    for (const teamKey in teams) {
      const player = teams[teamKey as keyof typeof teams].players.find(p => p.id === selectedPlayer);
      if (player) return player;
    }
    
    return null;
  };
  
  const currentPlayer = getSelectedPlayer();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="baseball-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-baseball-navy">Teams & Players</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-baseball-green hover:bg-baseball-green/90">
                Add New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Name</label>
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                <Button 
                  className="w-full bg-baseball-green hover:bg-baseball-green/90"
                  onClick={handleAddTeam}
                >
                  Create Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">My Teams</h3>
              
              <div className="space-y-2">
                {Object.entries(teams).map(([key, team]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                      activeTeam === key ? 'bg-baseball-navy text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTeam(key)}
                  >
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm">{team.players.length} players</div>
                  </div>
                ))}
              </div>
            </Card>
            
            {currentPlayer && (
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-4">Player Details</h3>
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-baseball-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                    {currentPlayer.number}
                  </div>
                  <div className="text-xl font-semibold">{currentPlayer.name}</div>
                  <div className="text-gray-500">{currentPlayer.position}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{currentPlayer.battingAverage}</div>
                    <div className="text-xs text-gray-500">AVG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{currentPlayer.stats?.[0].value}</div>
                    <div className="text-xs text-gray-500">HR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{currentPlayer.stats?.[1].value}</div>
                    <div className="text-xs text-gray-500">RBI</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-baseball-navy text-baseball-navy"
                  >
                    Edit Player
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-baseball-red text-baseball-red"
                    onClick={() => setSelectedPlayer(null)}
                  >
                    Close
                  </Button>
                </div>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {Object.entries(teams).map(([key, team]) => (
              activeTeam === key && (
                <div key={key}>
                  <Tabs defaultValue="roster">
                    <TabsList className="w-full">
                      <TabsTrigger value="roster" className="w-1/2">Team Roster</TabsTrigger>
                      <TabsTrigger value="stats" className="w-1/2">Team Stats</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="roster">
                      <TeamRoster
                        teamName={team.name}
                        players={team.players}
                        onPlayerSelect={handlePlayerSelect}
                        onAddPlayer={handleAddPlayer}
                      />
                    </TabsContent>
                    
                    <TabsContent value="stats">
                      <Card className="p-4">
                        <h3 className="font-semibold text-lg mb-4">{team.name} Team Stats</h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">.275</div>
                            <div className="text-xs text-gray-500">TEAM AVG</div>
                          </div>
                          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">32</div>
                            <div className="text-xs text-gray-500">TOTAL RUNS</div>
                          </div>
                          <div className="bg-baseball-lightGray p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">3-2</div>
                            <div className="text-xs text-gray-500">W-L RECORD</div>
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-3">Hitting Leaders</h4>
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>Batting Average</div>
                            <div className="font-semibold">
                              {team.players.length > 0 ? 
                                team.players.sort((a, b) => 
                                  parseFloat(b.battingAverage.replace('.', '0.')) - 
                                  parseFloat(a.battingAverage.replace('.', '0.'))
                                )[0].name : 'N/A'
                              } ({team.players.length > 0 ? 
                                team.players.sort((a, b) => 
                                  parseFloat(b.battingAverage.replace('.', '0.')) - 
                                  parseFloat(a.battingAverage.replace('.', '0.'))
                                )[0].battingAverage : 'N/A'})
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>Home Runs</div>
                            <div className="font-semibold">
                              {team.players.length > 0 ?
                                team.players.sort((a, b) => 
                                  (b.stats?.[0].value as number) - (a.stats?.[0].value as number)
                                )[0].name : 'N/A'
                              } ({team.players.length > 0 ? 
                                team.players.sort((a, b) => 
                                  (b.stats?.[0].value as number) - (a.stats?.[0].value as number)
                                )[0].stats?.[0].value : 'N/A'})
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>RBIs</div>
                            <div className="font-semibold">
                              {team.players.length > 0 ?
                                team.players.sort((a, b) => 
                                  (b.stats?.[1].value as number) - (a.stats?.[1].value as number)
                                )[0].name : 'N/A'
                              } ({team.players.length > 0 ? 
                                team.players.sort((a, b) => 
                                  (b.stats?.[1].value as number) - (a.stats?.[1].value as number)
                                )[0].stats?.[1].value : 'N/A'})
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full">View Detailed Stats</Button>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
