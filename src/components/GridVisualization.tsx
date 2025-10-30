import { motion, AnimatePresence } from "framer-motion";
import { Detective, Position, SimulationState, DETECTIVE_COLORS, DETECTIVE_EMOJIS } from "@/types/bfs";
import { Trophy, Lock, LockOpen, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [unlockedDoors, setUnlockedDoors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (simulationState?.result) {
      const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 50,
      }));
      setConfetti(confettiPieces);
    } else {
      setConfetti([]);
    }
  }, [simulationState?.result]);

  useEffect(() => {
    if (simulationState?.unlockedDoors && simulationState.grid) {
      const newUnlockedDoors = new Set<string>();
      simulationState.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === "unlocked") {
            newUnlockedDoors.add(`${r},${c}`);
          }
        });
      });
      setUnlockedDoors(newUnlockedDoors);
    }
  }, [simulationState?.unlockedDoors, simulationState?.grid]);

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
          className={`${color} rounded-full flex items-center justify-center text-2xl shadow-lg z-10 pixel-borders relative`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.4
          }}
          style={{ 
            width: cellSize * 0.8, 
            height: cellSize * 0.8,
            boxShadow: `0 0 10px ${color.replace('bg-', 'rgba(var(--')})`,
          }}
        >
          <motion.span
            className="animate-walk"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {DETECTIVE_EMOJIS[name]}
          </motion.span>
          {detective?.hasKey && (
            <motion.span 
              className="absolute -top-1 -right-1 text-xs"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔑
            </motion.span>
          )}
        </motion.div>
      );
    }

    if (cellType === "trophy") {
      return (
        <motion.div
          className="relative animate-trophy-glow"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy 
            className="text-grid-trophy fill-grid-trophy pixel-borders" 
            size={cellSize * 0.6}
            strokeWidth={3}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="text-yellow-300" size={cellSize * 0.8} />
          </motion.div>
        </motion.div>
      );
    }

    if (cellType === "locked") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-grid-locked pixel-borders"
        >
          <Lock size={cellSize * 0.5} strokeWidth={3} />
        </motion.div>
      );
    }

    if (cellType === "unlocked") {
      const justUnlocked = unlockedDoors.has(`${r},${c}`);
      return (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className={`text-grid-unlocked pixel-borders ${justUnlocked ? 'animate-unlock-flash' : ''}`}
        >
          <LockOpen size={cellSize * 0.5} strokeWidth={3} />
          {justUnlocked && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="text-green-400" size={cellSize * 0.6} />
            </motion.div>
          )}
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
    <div className="flex flex-col items-center gap-4 p-6 relative">
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-primary mb-2 pixel-borders"
          animate={{ textShadow: ["0 0 10px rgba(234, 179, 8, 0.5)", "0 0 20px rgba(234, 179, 8, 0.8)", "0 0 10px rgba(234, 179, 8, 0.5)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚨 NYPD 99th Precinct Investigation 🚨
        </motion.h2>
        {simulationState && (
          <p className="text-lg text-muted-foreground font-mono">
            Time Step: <span className="text-primary font-bold">{simulationState.time}</span>
          </p>
        )}
      </div>

      <div
        className="grid gap-1 p-6 bg-card rounded-lg border-4 border-primary shadow-2xl scanline retro-glow pixel-borders relative"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          borderImage: "repeating-linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 10px, transparent 10px, transparent 20px) 4",
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <motion.div
              key={`${r}-${c}`}
              className={`border-2 border-border/50 rounded flex items-center justify-center relative transition-colors pixel-borders ${getCellClassName(r, c)}`}
              style={{ 
                width: cellSize, 
                height: cellSize,
                boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)"
              }}
              whileHover={{ scale: 1.05, borderColor: "rgba(234, 179, 8, 0.5)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute top-0 left-0 text-[8px] text-muted-foreground/50 p-0.5 font-mono">
                {r},{c}
              </div>
              {getCellContent(r, c)}
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {simulationState?.result && (
          <>
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute text-2xl pointer-events-none animate-confetti"
                initial={{ x: `${piece.x}%`, y: `${piece.y}%`, rotate: 0 }}
                style={{ 
                  left: 0, 
                  top: 0,
                }}
              >
                {["🎉", "⭐", "🏆", "💛", "🎊"][piece.id % 5]}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="bg-primary text-primary-foreground px-8 py-6 rounded-lg shadow-2xl text-center animate-stamp border-4 border-yellow-400"
              style={{
                boxShadow: "0 0 30px rgba(234, 179, 8, 0.6), inset 0 0 20px rgba(0,0,0,0.2)"
              }}
            >
              <motion.h3 
                className="text-3xl font-bold mb-2 pixel-borders"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎉 CASE SOLVED! 🎉
              </motion.h3>
              <p className="text-xl font-mono">
                Detective <span className="font-bold text-yellow-300">{simulationState.result.name}</span> reached the trophy!
              </p>
              <p className="text-sm mt-2 font-mono">Time: {simulationState.result.time} steps</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
