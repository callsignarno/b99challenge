import { useState } from "react";
import { Detective, Position } from "@/types/bfs";
import { useBFSSimulation } from "@/hooks/useBFSSimulation";
import { GridVisualization } from "@/components/GridVisualization";
import { InputPanel } from "@/components/InputPanel";
import { ControlPanel } from "@/components/ControlPanel";
import { motion } from "framer-motion";

const Index = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(6);
  const [detectives, setDetectives] = useState<Detective[]>([]);
  const [trophy, setTrophy] = useState<Position>({ r: 5, c: 5 });
  const [lockedDoors, setLockedDoors] = useState<Position[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);

  const {
    simulationState,
    isRunning,
    speed,
    setSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepSimulation,
  } = useBFSSimulation(rows, cols, detectives, trophy, lockedDoors);

  const handleConfigSubmit = (
    newRows: number,
    newCols: number,
    newDetectives: Detective[],
    newTrophy: Position,
    newLockedDoors: Position[]
  ) => {
    setRows(newRows);
    setCols(newCols);
    setDetectives(newDetectives);
    setTrophy(newTrophy);
    setLockedDoors(newLockedDoors);
    setIsConfigured(true);
  };

  const handleReset = () => {
    resetSimulation();
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-card border-b-2 border-primary/30 py-6 sticky top-0 z-50 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            <span className="text-primary">BROOKLYN</span>{" "}
            <span className="text-foreground">NINE-NINE</span>
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Multi-Agent BFS Detective Challenge
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isConfigured ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <InputPanel onConfigSubmit={handleConfigSubmit} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Config (hidden on small screens when configured) */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-3 hidden lg:block"
            >
              <InputPanel onConfigSubmit={handleConfigSubmit} />
            </motion.div>

            {/* Center - Grid Visualization */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="lg:col-span-6 flex justify-center"
            >
              <GridVisualization
                rows={rows}
                cols={cols}
                simulationState={simulationState}
                detectives={detectives}
                trophy={trophy}
              />
            </motion.div>

            {/* Right Panel - Controls */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-3"
            >
              <ControlPanel
                isRunning={isRunning}
                speed={speed}
                onStart={startSimulation}
                onPause={pauseSimulation}
                onReset={handleReset}
                onStep={stepSimulation}
                onSpeedChange={setSpeed}
                queueSize={simulationState?.queue.length || 0}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-primary/30 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>🚨 Made with React, Tailwind CSS, and Framer Motion 🚨</p>
          <p className="mt-1">Inspired by Brooklyn Nine-Nine</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
