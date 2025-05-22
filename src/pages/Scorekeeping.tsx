
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoreboardDisplay from '@/components/ScoreboardDisplay';
import QuickActionPanel from '@/components/QuickActionPanel';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
}

const Scorekeeping = () => {
  const [activeTab, setActiveTab] = useState('scorekeeping');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>('');
  
  // Game state
  const [homeTeam, setHomeTeam] = useState('Home Team');
  const [awayTeam, setAwayTeam] = useState('Away Team');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [inning, setInning] = useState(1);
  const [isBottom, setIsBottom] = useState(false);
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  
  // Current batter/pitcher
  const [currentBatter, setCurrentBatter] = useState('');
  const [currentPitcher, setCurrentPitcher] = useState('');
  
  // Team players
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([]);

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      
      if (data) {
        console.log('Teams fetched:', data);
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  // Fetch players when a team is selected
  useEffect(() => {
    async function fetchPlayers(teamId: string, isHome: boolean) {
      if (!teamId) return;

      try {
        console.log(`Fetching players for team ${teamId}`);
        const { data, error } = await supabase
          .from('players')
          .select('id, name, number, position')
          .eq('team_id', teamId);
        
        if (error) {
          console.error(`Error fetching players for team ${teamId}:`, error);
          throw error;
        }
        
        if (data) {
          console.log(`Players fetched for team ${teamId}:`, data);
          if (isHome) {
            setHomeTeamPlayers(data);
          } else {
            setAwayTeamPlayers(data);
          }
        }
      } catch (error) {
        console.error(`Error fetching players for team ${teamId}:`, error);
        toast.error('Failed to load players');
      }
    }

    if (selectedHomeTeamId) {
      fetchPlayers(selectedHomeTeamId, true);
    }
    
    if (selectedAwayTeamId) {
      fetchPlayers(selectedAwayTeamId, false);
    }
  }, [selectedHomeTeamId, selectedAwayTeamId]);

  // Update team names when selection changes
  useEffect(() => {
    if (selectedHomeTeamId) {
      const selected = teams.find(team => team.id === selectedHomeTeamId);
      if (selected) {
        setHomeTeam(selected.name);
      }
    }
    
    if (selectedAwayTeamId) {
      const selected = teams.find(team => team.id === selectedAwayTeamId);
      if (selected) {
        setAwayTeam(selected.name);
      }
    }
  }, [selectedHomeTeamId, selectedAwayTeamId, teams]);
  
  // Handle quick actions
  const handleBallAction = () => {
    if (balls === 3) {
      // Walk the batter
      toast.info('Ball 4 - Batter walks to first base');
      setBalls(0);
      setStrikes(0);
    } else {
      setBalls(balls + 1);
    }
  };
  
  const handleStrikeAction = () => {
    if (strikes === 2) {
      // Strike out
      toast.info('Strike 3 - Batter is out');
      setBalls(0);
      setStrikes(0);
      handleOutAction();
    } else {
      setStrikes(strikes + 1);
    }
  };
  
  const handleHitAction = () => {
    toast.success('Hit recorded');
    setBalls(0);
    setStrikes(0);
  };
  
  const handleOutAction = () => {
    if (outs === 2) {
      // End of half-inning
      setOuts(0);
      if (isBottom) {
        // End of inning
        setInning(inning + 1);
        setIsBottom(false);
      } else {
        // Switch to bottom half
        setIsBottom(true);
      }
      toast.info(`End of ${isBottom ? 'inning' : 'half-inning'}`);
    } else {
      setOuts(outs + 1);
    }
  };
  
  const handleRunAction = () => {
    if (isBottom) {
      setHomeScore(homeScore + 1);
      toast.success('Run scored for the home team!');
    } else {
      setAwayScore(awayScore + 1);
      toast.success('Run scored for the away team!');
    }
  };
  
  const handleAdvanceInning = () => {
    if (isBottom) {
      setInning(inning + 1);
      setIsBottom(false);
    } else {
      setIsBottom(true);
    }
    setOuts(0);
    setBalls(0);
    setStrikes(0);
    toast.info(`Moving to ${isBottom ? 'top of inning ' + (inning + 1) : 'bottom of inning ' + inning}`);
  };
  
  const handleNewGame = () => {
    setHomeScore(0);
    setAwayScore(0);
    setInning(1);
    setIsBottom(false);
    setBalls(0);
    setStrikes(0);
    setOuts(0);
    setCurrentBatter('');
    setCurrentPitcher('');
    toast.info('New game started');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="baseball-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-baseball-navy">Scorekeeping</h1>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNewGame}
            >
              New Game
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
            >
              End Game
            </Button>
          </div>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="w-full bg-white">
            <TabsTrigger value="scorekeeping" className="w-1/3">Scorekeeping</TabsTrigger>
            <TabsTrigger value="lineup" className="w-1/3">Lineup</TabsTrigger>
            <TabsTrigger value="plays" className="w-1/3">Play History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scorekeeping">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Game Setup</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Team</label>
                      <Select
                        value={selectedHomeTeamId}
                        onValueChange={setSelectedHomeTeamId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Home Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.length > 0 ? (
                            teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No teams available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Away Team</label>
                      <Select
                        value={selectedAwayTeamId}
                        onValueChange={setSelectedAwayTeamId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Away Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.length > 0 ? (
                            teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No teams available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
                
                <ScoreboardDisplay
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  inning={inning}
                  isBottom={isBottom}
                  balls={balls}
                  strikes={strikes}
                  outs={outs}
                />
                
                <Card className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="w-1/2 pr-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batting Team</label>
                      <div className="font-semibold">
                        {isBottom ? homeTeam : awayTeam}
                      </div>
                    </div>
                    <div className="w-1/2 pl-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fielding Team</label>
                      <div className="font-semibold">
                        {isBottom ? awayTeam : homeTeam}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="w-1/2 pr-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Batter</label>
                      <Select
                        value={currentBatter}
                        onValueChange={setCurrentBatter}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Batter" />
                        </SelectTrigger>
                        <SelectContent>
                          {(isBottom ? homeTeamPlayers : awayTeamPlayers).length > 0 ? (
                            (isBottom ? homeTeamPlayers : awayTeamPlayers).map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name} #{player.number}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No players available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-1/2 pl-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Pitcher</label>
                      <Select
                        value={currentPitcher}
                        onValueChange={setCurrentPitcher}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Pitcher" />
                        </SelectTrigger>
                        <SelectContent>
                          {(isBottom ? awayTeamPlayers : homeTeamPlayers).length > 0 ? (
                            (isBottom ? awayTeamPlayers : homeTeamPlayers).map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name} #{player.number}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No players available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <QuickActionPanel
                  onBallAction={handleBallAction}
                  onStrikeAction={handleStrikeAction}
                  onHitAction={handleHitAction}
                  onOutAction={handleOutAction}
                  onRunAction={handleRunAction}
                  onAdvanceInning={handleAdvanceInning}
                />
                
                <Card className="mt-6 p-4">
                  <h3 className="font-semibold text-baseball-navy text-lg mb-4">Advanced Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">Record Hit Type</Button>
                    <Button variant="outline">Substitute Player</Button>
                    <Button variant="outline">Field Error</Button>
                    <Button variant="outline">Defensive Play</Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lineup">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-4">Lineup Management</h3>
              <p className="text-gray-500">Configure batting order and field positions for both teams</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">{homeTeam} Lineup</h4>
                  <div className="space-y-2 text-sm">
                    {homeTeamPlayers.map((player, index) => (
                      <div key={player.id} className="flex items-center p-2 border rounded-md">
                        <div className="w-8 h-8 rounded-full bg-baseball-navy text-white flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>{player.name} #{player.number}</div>
                      </div>
                    ))}
                    {homeTeamPlayers.length === 0 && (
                      <div className="text-gray-500 p-2">No players available. Please select a team.</div>
                    )}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">{awayTeam} Lineup</h4>
                  <div className="space-y-2 text-sm">
                    {awayTeamPlayers.map((player, index) => (
                      <div key={player.id} className="flex items-center p-2 border rounded-md">
                        <div className="w-8 h-8 rounded-full bg-baseball-navy text-white flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>{player.name} #{player.number}</div>
                      </div>
                    ))}
                    {awayTeamPlayers.length === 0 && (
                      <div className="text-gray-500 p-2">No players available. Please select a team.</div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plays">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-4">Play History</h3>
              <p className="text-gray-500 mb-4">Record of all plays in the current game</p>
              
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-baseball-orange">
                  <div className="text-xs text-gray-500">Top 1st • 2 Outs</div>
                  <div>Thompson hit a single to center field</div>
                </div>
                <div className="p-3 border-l-4 border-baseball-red">
                  <div className="text-xs text-gray-500">Top 1st • 3 Outs</div>
                  <div>Davis struck out swinging</div>
                </div>
                <div className="p-3 border-l-4 border-baseball-green">
                  <div className="text-xs text-gray-500">Bottom 1st • 0 Outs</div>
                  <div>Smith hit a double to right field</div>
                </div>
                <div className="p-3 border-l-4 border-baseball-green">
                  <div className="text-xs text-gray-500">Bottom 1st • 0 Outs</div>
                  <div>Johnson drove in Smith with a sacrifice fly</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Scorekeeping;
