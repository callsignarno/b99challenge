import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onSpeedChange: (speed: number) => void;
  queueSize: number;
}

export const ControlPanel = ({
  isRunning,
  speed,
  onStart,
  onPause,
  onReset,
  onStep,
  onSpeedChange,
  queueSize,
}: ControlPanelProps) => {
  const speedLabel = speed <= 200 ? "Fast" : speed <= 500 ? "Normal" : "Slow";

  return (
    <Card className="w-full max-w-md h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-primary">🎮 Control Center</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {!isRunning ? (
            <Button onClick={onStart} size="lg" className="font-bold">
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={onPause} size="lg" variant="secondary" className="font-bold">
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={onReset} size="lg" variant="outline" className="font-bold">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onStep}
            size="lg"
            variant="outline"
            disabled={isRunning}
            className="col-span-2 font-bold"
          >
            <SkipForward className="h-5 w-5 mr-2" />
            Step Forward
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Simulation Speed</Label>
            <span className="text-sm text-primary font-bold">{speedLabel}</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={100}
            max={1000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>

        {/* BFS Stats */}
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h4 className="font-bold text-sm text-foreground">📊 BFS Queue Status</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Queue Size:</span>
            <span className="text-lg font-bold text-primary">{queueSize}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h4 className="font-bold text-sm text-foreground">🎭 Detective Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-jake rounded-full flex items-center justify-center">🕶️</div>
              <span>Jake Peralta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amy rounded-full flex items-center justify-center">💼</div>
              <span>Amy Santiago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-rosa rounded-full flex items-center justify-center">🖤</div>
              <span>Rosa Diaz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-terry rounded-full flex items-center justify-center">💪</div>
              <span>Terry Jeffords</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
