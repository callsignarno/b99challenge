import { motion } from "framer-motion";
import { Detective, Position, SimulationState, DETECTIVE_COLORS, DETECTIVE_EMOJIS } from "@/types/bfs";
import { Trophy, Lock, LockOpen } from "lucide-react";

interface GridVisualizationProps {
  rows: number;
  cols: number;
  simulationState: SimulationState | null;
  detectives: Detective[];
  trophy: Position;
}

export const GridVisualization = ({
  rows,
  cols,
  simulationState,
  detectives,
  trophy,
}: GridVisualizationProps) => {
  const cellSize = Math.min(60, Math.floor(600 / Math.max(rows, cols)));

  const getCellContent = (r: number, c: number) => {
    if (!simulationState || !simulationState.grid || !simulationState.grid[r]) return null;

    const cellType = simulationState.grid[r][c];
    
    // Check if any detective is at this position
    const detectiveAtPos = Array.from(simulationState.detectives.entries()).find(
      ([_, pos]) => pos.r === r && pos.c === c
    );

    if (detectiveAtPos) {
      const [name] = detectiveAtPos;
      const detective = detectives.find(d => d.name === name);
      const color = DETECTIVE_COLORS[name] || "bg-primary";
      
      return (
        <motion.div
          key={`detective-${name}-${r}-${c}`}
          className={`${color} rounded-full flex items-center justify-center text-2xl shadow-lg z-10`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ width: cellSize * 0.8, height: cellSize * 0.8 }}
        >
          {DETECTIVE_EMOJIS[name]}
          {detective?.hasKey && (
            <span className="absolute -top-1 -right-1 text-xs">🔑</span>
          )}
        </motion.div>
      );
    }

    if (cellType === "trophy") {
      return (
        <motion.div
          className="text-4xl animate-trophy-glow"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="text-grid-trophy fill-grid-trophy" size={cellSize * 0.6} />
        </motion.div>
      );
    }

    if (cellType === "locked") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-grid-locked"
        >
          <Lock size={cellSize * 0.5} />
        </motion.div>
      );
    }

    if (cellType === "unlocked") {
      return (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-grid-unlocked"
        >
          <LockOpen size={cellSize * 0.5} />
        </motion.div>
      );
    }

    return null;
  };

  const getCellClassName = (r: number, c: number) => {
    if (!simulationState || !simulationState.grid || !simulationState.grid[r]) return "bg-grid-empty";
    
    const cellType = simulationState.grid[r][c];
    const isVisited = simulationState.visitedPositions.has(`${r},${c}`);
    
    if (cellType === "trophy") return "bg-grid-trophy/20";
    if (cellType === "locked") return "bg-grid-locked/30";
    if (cellType === "unlocked") return "bg-grid-unlocked/20";
    if (isVisited) return "bg-muted/50";
    
    return "bg-grid-empty";
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          🚨 NYPD 99th Precinct Investigation 🚨
        </h2>
        {simulationState && (
          <p className="text-lg text-muted-foreground">
            Time Step: <span className="text-primary font-bold">{simulationState.time}</span>
          </p>
        )}
      </div>

      <div
        className="grid gap-1 p-6 bg-card rounded-lg border-2 border-primary/30 shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <motion.div
              key={`${r}-${c}`}
              className={`border border-border/50 rounded flex items-center justify-center relative transition-colors ${getCellClassName(r, c)}`}
              style={{ width: cellSize, height: cellSize }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute top-0 left-0 text-[8px] text-muted-foreground/50 p-0.5">
                {r},{c}
              </div>
              {getCellContent(r, c)}
            </motion.div>
          ))
        )}
      </div>

      {simulationState?.result && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg shadow-xl text-center animate-bounce-in"
        >
          <h3 className="text-2xl font-bold mb-2">🎉 CASE SOLVED! 🎉</h3>
          <p className="text-lg">
            Detective <span className="font-bold">{simulationState.result.name}</span> reached the trophy!
          </p>
          <p className="text-sm mt-1">Time: {simulationState.result.time} steps</p>
        </motion.div>
      )}
    </div>
  );
};
