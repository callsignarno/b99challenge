export interface Detective {
  name: string;
  r: number;
  c: number;
  hasKey: boolean;
  color: string;
}

export interface Position {
  r: number;
  c: number;
}

export interface BFSState {
  r: number;
  c: number;
  hasKey: boolean;
  time: number;
  name: string;
}

export interface SimulationState {
  grid: string[][];
  detectives: Map<string, Position>;
  time: number;
  queue: BFSState[];
  result: { time: number; name: string } | null;
  unlockedDoors: boolean;
  visitedPositions: Set<string>;
}

export const DETECTIVE_COLORS: Record<string, string> = {
  Jake: "bg-jake",
  Amy: "bg-amy",
  Rosa: "bg-rosa",
  Terry: "bg-terry",
};

export const DETECTIVE_EMOJIS: Record<string, string> = {
  Jake: "🕶️",
  Amy: "💼",
  Rosa: "🖤",
  Terry: "💪",
};
