
import { 
  Check, 
  ChevronRight, 
  MinusIcon, 
  Plus, 
  X 
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
          className="quick-action-btn"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Ball</div>
            <div className="text-2xl font-bold">B</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onStrikeAction}
          className="quick-action-btn"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Strike</div>
            <div className="text-2xl font-bold">S</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onOutAction}
          className="quick-action-btn danger"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Out</div>
            <X size={20} className="mx-auto" />
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onHitAction}
          className="quick-action-btn success"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Hit</div>
            <Check size={20} className="mx-auto" />
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onRunAction}
          className="quick-action-btn warning"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Run</div>
            <Plus size={20} className="mx-auto" />
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onAdvanceInning}
          className="quick-action-btn"
        >
          <div className="text-center">
            <div className="text-sm mb-1">Inning</div>
            <ChevronRight size={20} className="mx-auto" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActionPanel;
