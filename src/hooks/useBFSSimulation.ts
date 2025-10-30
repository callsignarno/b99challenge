import { useState, useCallback, useRef, useEffect } from "react";
import { Detective, Position, BFSState, SimulationState } from "@/types/bfs";

export const useBFSSimulation = (
  rows: number,
  cols: number,
  detectives: Detective[],
  trophy: Position,
  lockedDoors: Position[]
) => {
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const initializeSimulation = useCallback(() => {
    const grid: string[][] = Array(rows).fill(0).map(() => Array(cols).fill("empty"));
    
    // Mark locked doors
    lockedDoors.forEach(({ r, c }) => {
      grid[r][c] = "locked";
    });
    
    // Mark trophy
    grid[trophy.r][trophy.c] = "trophy";

    // Initialize detective positions
    const detectivePositions = new Map<string, Position>();
    detectives.forEach((d) => {
      detectivePositions.set(d.name, { r: d.r, c: d.c });
    });

    // Initialize BFS queue
    const queue: BFSState[] = detectives.map((d) => ({
      r: d.r,
      c: d.c,
      hasKey: d.hasKey,
      time: 0,
      name: d.name,
    }));

    // Initialize visited tracking
    const visited: boolean[][][] = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => [false, false])
    );

    detectives.forEach((d) => {
      visited[d.r][d.c][d.hasKey ? 1 : 0] = true;
    });

    setSimulationState({
      grid,
      detectives: detectivePositions,
      time: 0,
      queue,
      result: null,
      unlockedDoors: false,
      visitedPositions: new Set(detectives.map(d => `${d.r},${d.c}`)),
    });
  }, [rows, cols, detectives, trophy, lockedDoors]);

  const stepSimulation = useCallback(() => {
    if (!simulationState || simulationState.result) return;

    const { grid, detectives: detectivePositions, time, queue, unlockedDoors } = simulationState;
    const newQueue: BFSState[] = [];
    const newDetectivePositions = new Map(detectivePositions);
    const newVisitedPositions = new Set(simulationState.visitedPositions);
    let newUnlockedDoors = unlockedDoors;
    let result = null;

    const visited: boolean[][][] = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => [false, false])
    );

    // Process current level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const { r, c, hasKey, name } = queue[i];

      // Check if reached trophy
      if (r === trophy.r && c === trophy.c) {
        result = { time: time + 1, name };
        break;
      }

      // Explore neighbors
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          // Check if locked door blocks path
          const isLocked = grid[nr][nc] === "locked";
          if (isLocked && !hasKey && !newUnlockedDoors) {
            continue;
          }

          const state = (newUnlockedDoors || hasKey) ? 1 : 0;
          if (!visited[nr][nc][state]) {
            visited[nr][nc][state] = true;
            newQueue.push({
              r: nr,
              c: nc,
              hasKey: hasKey || newUnlockedDoors,
              time: time + 1,
              name,
            });

            // Update detective position
            newDetectivePositions.set(name, { r: nr, c: nc });
            newVisitedPositions.add(`${nr},${nc}`);

            // Unlock doors if detective with key reaches locked door
            if (isLocked && (hasKey || newUnlockedDoors)) {
              newUnlockedDoors = true;
            }
          }
        }
      }
    }

    // Update grid for unlocked doors
    const newGrid = grid.map(row => [...row]);
    if (newUnlockedDoors && !unlockedDoors) {
      lockedDoors.forEach(({ r, c }) => {
        if (newGrid[r][c] === "locked") {
          newGrid[r][c] = "unlocked";
        }
      });
    }

    setSimulationState({
      grid: newGrid,
      detectives: newDetectivePositions,
      time: time + 1,
      queue: newQueue,
      result,
      unlockedDoors: newUnlockedDoors,
      visitedPositions: newVisitedPositions,
    });

    if (result || newQueue.length === 0) {
      setIsRunning(false);
    }
  }, [simulationState, rows, cols, trophy, lockedDoors, directions]);

  const startSimulation = useCallback(() => {
    if (!simulationState) {
      initializeSimulation();
    }
    setIsRunning(true);
  }, [simulationState, initializeSimulation]);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    initializeSimulation();
  }, [initializeSimulation]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        stepSimulation();
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, stepSimulation]);

  return {
    simulationState,
    isRunning,
    speed,
    setSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepSimulation,
    initializeSimulation,
  };
};
