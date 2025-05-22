
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

// Sample data for charts
const battingData = [
  { name: 'Smith', avg: 0.315, hr: 3, rbi: 17, sb: 5 },
  { name: 'Johnson', avg: 0.287, hr: 1, rbi: 12, sb: 0 },
  { name: 'Rodriguez', avg: 0.324, hr: 2, rbi: 14, sb: 8 },
  { name: 'Kim', avg: 0.301, hr: 5, rbi: 22, sb: 3 },
  { name: 'Thompson', avg: 0.275, hr: 7, rbi: 28, sb: 1 },
  { name: 'Davis', avg: 0.189, hr: 0, rbi: 5, sb: 0 },
];

const teamPerformanceData = [
  { name: 'Game 1', runs: 5, hits: 9, errors: 1 },
  { name: 'Game 2', runs: 3, hits: 7, errors: 0 },
  { name: 'Game 3', runs: 0, hits: 4, errors: 2 },
  { name: 'Game 4', runs: 8, hits: 12, errors: 1 },
  { name: 'Game 5', runs: 4, hits: 8, errors: 0 },
];

const hitTypeData = [
  { name: 'Singles', value: 42 },
  { name: 'Doubles', value: 15 },
  { name: 'Triples', value: 3 },
  { name: 'Home Runs', value: 7 },
];

const playerStats = [
  {
    name: 'Mike Smith',
    position: 'P',
    games: 5,
    atBats: 12,
    hits: 4,
    avg: '.333',
    rbi: 2,
  },
  {
    name: 'Jason Johnson',
    position: 'C',
    games: 5,
    atBats: 18,
    hits: 5,
    avg: '.278',
    rbi: 3,
  },
  {
    name: 'Carlos Rodriguez',
    position: 'SS',
    games: 5,
    atBats: 19,
    hits: 8,
    avg: '.421',
    rbi: 5,
  },
  {
    name: 'Jun Kim',
    position: 'OF',
    games: 4,
    atBats: 15,
    hits: 4,
    avg: '.267',
    rbi: 4,
  },
  {
    name: 'Ryan Thompson',
    position: '1B',
    games: 5,
    atBats: 20,
    hits: 6,
    avg: '.300',
    rbi: 7,
  },
  {
    name: 'Marcus Davis',
    position: 'P',
    games: 4,
    atBats: 9,
    hits: 2,
    avg: '.222',
    rbi: 0,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="baseball-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-baseball-navy">Stats Dashboard</h1>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">Filter by:</div>
            <Select defaultValue="season">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Season</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="game">Last Game</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="eagles">Eagles</SelectItem>
                <SelectItem value="tigers">Tigers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Team Batting Average</div>
            <div className="text-3xl font-bold mb-1">.285</div>
            <div className="text-xs text-baseball-green">↑ 0.12 from last week</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-500">Runs Scored</div>
            <div className="text-3xl font-bold mb-1">32</div>
            <div className="text-xs text-baseball-green">↑ 8 from last week</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-500">Win-Loss Record</div>
            <div className="text-3xl font-bold mb-1">3-2</div>
            <div className="text-xs text-baseball-green">Won last game</div>
          </Card>
        </div>
        
        <Tabs defaultValue="batting" className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="batting" className="w-1/4">Batting</TabsTrigger>
            <TabsTrigger value="pitching" className="w-1/4">Pitching</TabsTrigger>
            <TabsTrigger value="fielding" className="w-1/4">Fielding</TabsTrigger>
            <TabsTrigger value="games" className="w-1/4">Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batting">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-4">Batting Average by Player</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={battingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 0.35]} />
                      <Tooltip formatter={(value) => value.toFixed(3)} />
                      <Bar dataKey="avg" fill="#2CA58D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-4">Hit Types</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hitTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {hitTypeData.map((entry, index) => {
                          const colors = ['#0A2342', '#2CA58D', '#F97316', '#ea384c'];
                          return <Pie key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip formatter={(value) => value} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            
            <Card className="mt-6 p-4">
              <h3 className="font-semibold text-lg mb-4">Batting Leaders</h3>
              <ScrollArea className="h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-medium">Player</th>
                      <th className="pb-2 font-medium">Pos</th>
                      <th className="pb-2 font-medium text-center">G</th>
                      <th className="pb-2 font-medium text-center">AB</th>
                      <th className="pb-2 font-medium text-center">H</th>
                      <th className="pb-2 font-medium text-center">AVG</th>
                      <th className="pb-2 font-medium text-center">RBI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">{player.name}</td>
                        <td>{player.position}</td>
                        <td className="text-center">{player.games}</td>
                        <td className="text-center">{player.atBats}</td>
                        <td className="text-center">{player.hits}</td>
                        <td className="text-center font-semibold">{player.avg}</td>
                        <td className="text-center">{player.rbi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="pitching">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Pitching Stats</h3>
              <p className="text-gray-500">Pitching statistics will be displayed here.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="fielding">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Fielding Stats</h3>
              <p className="text-gray-500">Fielding statistics will be displayed here.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="games">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Team Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="runs" stroke="#0A2342" strokeWidth={2} />
                    <Line type="monotone" dataKey="hits" stroke="#2CA58D" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="#ea384c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
