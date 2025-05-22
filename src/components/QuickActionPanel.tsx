
import { 
  Check, 
  ChevronRight, 
  X, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionPanelProps {
  onBallAction: () => void;
  onStrikeAction: () => void;
  onHitAction: () => void;
  onOutAction: () => void;
  onRunAction: () => void;
  onAdvanceInning: () => void;
}

const QuickActionPanel = ({
  onBallAction,
  onStrikeAction,
  onHitAction,
  onOutAction,
  onRunAction,
  onAdvanceInning
}: QuickActionPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-baseball-navy text-lg mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          onClick={onBallAction}
          className="h-20 flex flex-col items-center justify-center border-baseball-navy hover:bg-blue-50"
        >
          <div className="text-sm mb-1">Ball</div>
          <div className="text-2xl font-bold">B</div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onStrikeAction}
          className="h-20 flex flex-col items-center justify-center border-baseball-navy hover:bg-blue-50"
        >
          <div className="text-sm mb-1">Strike</div>
          <div className="text-2xl font-bold">S</div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onOutAction}
          className="h-20 flex flex-col items-center justify-center border-red-500 text-red-500 hover:bg-red-50"
        >
          <div className="text-sm mb-1">Out</div>
          <X size={20} className="mx-auto" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onHitAction}
          className="h-20 flex flex-col items-center justify-center border-green-500 text-green-500 hover:bg-green-50"
        >
          <div className="text-sm mb-1">Hit</div>
          <Check size={20} className="mx-auto" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onRunAction}
          className="h-20 flex flex-col items-center justify-center border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          <div className="text-sm mb-1">Run</div>
          <Plus size={20} className="mx-auto" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onAdvanceInning}
          className="h-20 flex flex-col items-center justify-center border-baseball-navy hover:bg-blue-50"
        >
          <div className="text-sm mb-1">Inning</div>
          <ChevronRight size={20} className="mx-auto" />
        </Button>
      </div>
    </div>
  );
};

export default QuickActionPanel;
