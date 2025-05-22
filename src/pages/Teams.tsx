import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamRoster from '@/components/TeamRoster';
import PlayerCard from '@/components/PlayerCard';
import { toast } from 'sonner';
import { supabase, getDefaultOwnerId } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash } from 'lucide-react';

// Interface definitions for better type safety
interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  battingAverage: string;
  stats: { label: string; value: number }[];
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface TeamsState {
  [key: string]: Team;
}

const Teams = () => {
  const [teams, setTeams] = useState<TeamsState>({});
  const [activeTeam, setActiveTeam] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('id, name');
      
      if (error) {
        throw error;
      }
      
      if (teamsData && teamsData.length > 0) {
        const teamsObj: TeamsState = {};
        
        for (const team of teamsData) {
          // Fetch players for this team
          const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select('*')
            .eq('team_id', team.id);
          
          if (playersError) {
            console.error('Error fetching players for team', team.id, playersError);
          }
          
          // Format players data
          const formattedPlayers = playersData?.map(player => ({
            id: player.id,
            name: player.name,
            number: player.number || '',
            position: player.position || '',
            battingAverage: player.batting_average || '.000',
            stats: [
              { label: 'HR', value: 0 },
              { label: 'RBI', value: 0 },
              { label: 'SB', value: 0 }
            ]
          })) || [];
          
          // Add team to state
          teamsObj[team.id] = {
            id: team.id,
            name: team.name,
            players: formattedPlayers
          };
        }
        
        setTeams(teamsObj);
        
        // Set active team to first team if no active team
        if (!activeTeam && Object.keys(teamsObj).length > 0) {
          setActiveTeam(Object.keys(teamsObj)[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTeam = async () => {
    if (newTeamName) {
      try {
        // Get the owner ID
        const ownerId = await getDefaultOwnerId();
        
        // Save team to database
        const { data, error } = await supabase
          .from('teams')
          .insert({ 
            name: newTeamName, 
            owner_id: ownerId 
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        if (data && data[0]) {
          const newTeam = data[0];
          
          // Update local state
          setTeams(prevTeams => ({
            ...prevTeams,
            [newTeam.id]: {
              id: newTeam.id,
              name: newTeam.name,
              players: []
            }
          }));
          
          setActiveTeam(newTeam.id);
          setNewTeamName('');
          toast.success(`${newTeam.name} added`);
        }
      } catch (error) {
        console.error('Error adding team:', error);
        toast.error('Failed to add team');
      }
    }
  };
  
  const handleAddPlayer = async (playerName: string, playerNumber: string, position: string) => {
    try {
      // Save player to database
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: playerName,
          number: playerNumber,
          position: position,
          team_id: activeTeam,
          batting_average: '.000'
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        const newPlayer = {
          id: data[0].id,
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
        
        // Update local state
        setTeams(prevTeams => ({
          ...prevTeams,
          [activeTeam]: {
            ...prevTeams[activeTeam],
            players: [
              ...prevTeams[activeTeam].players,
              newPlayer
            ]
          }
        }));
        
        toast.success(`${playerName} added to roster`);
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player');
    }
  };
  
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
  };
  
  const getSelectedPlayer = () => {
    if (!selectedPlayer) return null;
    
    for (const teamKey in teams) {
      const player = teams[teamKey].players.find(p => p.id === selectedPlayer);
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
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading teams...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4 mb-6">
                <h3 className="font-semibold text-lg mb-4">My Teams</h3>
                
                <div className="space-y-2">
                  {Object.values(teams).map((team) => (
                    <div
                      key={team.id}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        activeTeam === team.id ? 'bg-baseball-navy text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div 
                        className="font-medium flex-grow"
                        onClick={() => setActiveTeam(team.id)}
                      >
                        {team.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">{team.players.length} players</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-red-600 flex items-center cursor-pointer"
                              onClick={() => handleDeleteTeam(team.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
                
                {Object.keys(teams).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No teams yet. Create your first team!
                  </p>
                )}
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
              {activeTeam && teams[activeTeam] && (
                <div>
                  <Tabs defaultValue="roster">
                    <TabsList className="w-full">
                      <TabsTrigger value="roster" className="w-1/2">Team Roster</TabsTrigger>
                      <TabsTrigger value="stats" className="w-1/2">Team Stats</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="roster">
                      <TeamRoster
                        teamName={teams[activeTeam].name}
                        players={teams[activeTeam].players}
                        onPlayerSelect={handlePlayerSelect}
                        onAddPlayer={handleAddPlayer}
                      />
                    </TabsContent>
                    
                    <TabsContent value="stats">
                      <Card className="p-4">
                        <h3 className="font-semibold text-lg mb-4">{teams[activeTeam].name} Team Stats</h3>
                        
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
                              {teams[activeTeam].players.length > 0 ? 
                                teams[activeTeam].players.sort((a, b) => 
                                  parseFloat(b.battingAverage.replace('.', '0.')) - 
                                  parseFloat(a.battingAverage.replace('.', '0.'))
                                )[0]?.name || 'N/A' : 'N/A'
                              } ({teams[activeTeam].players.length > 0 ? 
                                teams[activeTeam].players.sort((a, b) => 
                                  parseFloat(b.battingAverage.replace('.', '0.')) - 
                                  parseFloat(a.battingAverage.replace('.', '0.'))
                                )[0]?.battingAverage || 'N/A' : 'N/A'})
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>Home Runs</div>
                            <div className="font-semibold">
                              {teams[activeTeam].players.length > 0 ?
                                teams[activeTeam].players.sort((a, b) => 
                                  (b.stats?.[0].value as number) - (a.stats?.[0].value as number)
                                )[0]?.name || 'N/A' : 'N/A'
                              } ({teams[activeTeam].players.length > 0 ? 
                                teams[activeTeam].players.sort((a, b) => 
                                  (b.stats?.[0].value as number) - (a.stats?.[0].value as number)
                                )[0]?.stats?.[0].value || 'N/A' : 'N/A'})
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>RBIs</div>
                            <div className="font-semibold">
                              {teams[activeTeam].players.length > 0 ?
                                teams[activeTeam].players.sort((a, b) => 
                                  (b.stats?.[1].value as number) - (a.stats?.[1].value as number)
                                )[0]?.name || 'N/A' : 'N/A'
                              } ({teams[activeTeam].players.length > 0 ? 
                                teams[activeTeam].players.sort((a, b) => 
                                  (b.stats?.[1].value as number) - (a.stats?.[1].value as number)
                                )[0]?.stats?.[1].value || 'N/A' : 'N/A'})
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full">View Detailed Stats</Button>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {!activeTeam && Object.keys(teams).length > 0 && (
                <div className="bg-white rounded-lg shadow p-10 text-center">
                  <p className="text-gray-500">Select a team to view details</p>
                </div>
              )}

              {Object.keys(teams).length === 0 && (
                <div className="bg-white rounded-lg shadow p-10 text-center">
                  <p className="text-gray-500">No teams available. Create your first team!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
