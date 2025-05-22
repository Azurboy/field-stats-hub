
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ChartPieIcon, ClipboardCheck, Upload, Users } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Sample game data - in a real app this would come from an API or database
  const recentGames = [
    {
      id: '1',
      homeTeam: 'Eagles',
      awayTeam: 'Tigers',
      homeScore: 5,
      awayScore: 3,
      date: 'May 20, 2025',
      location: 'Memorial Field',
      status: 'final'
    },
    {
      id: '2',
      homeTeam: 'Bears',
      awayTeam: 'Hawks',
      homeScore: 2,
      awayScore: 2,
      date: 'May 21, 2025',
      location: 'Central Park',
      status: 'in-progress'
    },
    {
      id: '3',
      homeTeam: 'Lions',
      awayTeam: 'Wolves',
      homeScore: 0,
      awayScore: 0,
      date: 'May 24, 2025',
      location: 'University Field',
      status: 'upcoming'
    }
  ];
  
  const featureLinks = [
    {
      title: 'Scorekeeping',
      description: 'Record plays, track stats, and manage games in real-time',
      icon: <ClipboardCheck size={40} />,
      path: '/scorekeeping',
      color: 'bg-baseball-navy'
    },
    {
      title: 'Team Management',
      description: 'Manage teams and player rosters with detailed profiles',
      icon: <Users size={40} />,
      path: '/teams',
      color: 'bg-baseball-green'
    },
    {
      title: 'Stats Dashboard',
      description: 'View comprehensive game stats and analytics',
      icon: <ChartPieIcon size={40} />,
      path: '/dashboard',
      color: 'bg-baseball-orange'
    },
    {
      title: 'Upload Scoresheet',
      description: 'Scan paper scoresheets and convert them to digital data',
      icon: <Upload size={40} />,
      path: '/upload',
      color: 'bg-baseball-red'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-baseball-navy text-white">
        <div className="baseball-container py-12 md:py-20">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Baseball & Softball<br />Scorekeeping Made Easy
              </h1>
              <p className="text-lg opacity-90 mb-6 max-w-lg mx-auto md:mx-0">
                Record plays, track stats, and analyze games with our intuitive scorekeeping system
              </p>
              <div className="space-x-4">
                {session ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-baseball-green hover:bg-baseball-green/90"
                      asChild
                    >
                      <Link to="/scorekeeping">Start Scorekeeping</Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-white text-white hover:bg-white hover:text-baseball-navy"
                      asChild
                    >
                      <Link to="/teams">Manage Teams</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-baseball-green hover:bg-baseball-green/90"
                      asChild
                    >
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-white text-white hover:bg-white hover:text-baseball-navy"
                      asChild
                    >
                      <Link to="/auth?register=true">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <Calendar size={240} className="text-baseball-green" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="baseball-container py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureLinks.map((feature, index) => (
            <Link 
              key={index}
              to={feature.path}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className={`${feature.color} text-white p-3 rounded-full inline-block mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Games Section */}
      <div className="baseball-container py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Games</h2>
          <Button 
            variant="outline"
            className="border-baseball-navy text-baseball-navy"
            asChild
          >
            <Link to="/scorekeeping">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentGames.map((game) => (
            <GameCard
              key={game.id}
              homeTeam={game.homeTeam}
              awayTeam={game.awayTeam}
              homeScore={game.homeScore}
              awayScore={game.awayScore}
              date={game.date}
              location={game.location}
              status={game.status as 'upcoming' | 'in-progress' | 'final'}
              onClick={() => console.log('Game selected:', game.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
