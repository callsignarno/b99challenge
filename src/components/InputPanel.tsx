import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Detective, Position } from "@/types/bfs";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface InputPanelProps {
  onConfigSubmit: (
    rows: number,
    cols: number,
    detectives: Detective[],
    trophy: Position,
    lockedDoors: Position[]
  ) => void;
}

const DETECTIVE_NAMES = ["Jake", "Amy", "Rosa", "Terry"];
const DETECTIVE_COLORS = {
  Jake: "bg-jake",
  Amy: "bg-amy",
  Rosa: "bg-rosa",
  Terry: "bg-terry",
};

export const InputPanel = ({ onConfigSubmit }: InputPanelProps) => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(6);
  const [detectives, setDetectives] = useState<Detective[]>([
    { name: "Jake", r: 0, c: 0, hasKey: true, color: DETECTIVE_COLORS.Jake },
  ]);
  const [trophy, setTrophy] = useState<Position>({ r: 5, c: 5 });
  const [lockedDoors, setLockedDoors] = useState<Position[]>([{ r: 2, c: 2 }]);

  const addDetective = () => {
    const availableNames = DETECTIVE_NAMES.filter(
      (name) => !detectives.some((d) => d.name === name)
    );
    if (availableNames.length > 0) {
      const name = availableNames[0];
      setDetectives([
        ...detectives,
        { name, r: 0, c: 0, hasKey: false, color: DETECTIVE_COLORS[name as keyof typeof DETECTIVE_COLORS] },
      ]);
    }
  };

  const removeDetective = (index: number) => {
    setDetectives(detectives.filter((_, i) => i !== index));
  };

  const updateDetective = (index: number, field: keyof Detective, value: any) => {
    const updated = [...detectives];
    updated[index] = { ...updated[index], [field]: value };
    setDetectives(updated);
  };

  const addLockedDoor = () => {
    setLockedDoors([...lockedDoors, { r: 0, c: 0 }]);
  };

  const removeLockedDoor = (index: number) => {
    setLockedDoors(lockedDoors.filter((_, i) => i !== index));
  };

  const updateLockedDoor = (index: number, field: "r" | "c", value: number) => {
    const updated = [...lockedDoors];
    updated[index] = { ...updated[index], [field]: value };
    setLockedDoors(updated);
  };

  const handleSubmit = () => {
    onConfigSubmit(rows, cols, detectives, trophy, lockedDoors);
  };

  return (
    <Card className="w-full max-w-md h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-primary">⚙️ Mission Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Grid Size */}
        <div className="space-y-2">
          <Label>Grid Size</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Rows"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={20}
            />
            <Input
              type="number"
              placeholder="Cols"
              value={cols}
              onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={20}
            />
          </div>
        </div>

        {/* Detectives */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Detectives</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={addDetective}
              disabled={detectives.length >= 4}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {detectives.map((detective, i) => (
            <Card key={i} className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-bold ${detective.color} text-foreground`}>
                  {detective.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeDetective(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Row"
                  value={detective.r}
                  onChange={(e) =>
                    updateDetective(i, "r", Math.max(0, Math.min(rows - 1, parseInt(e.target.value) || 0)))
                  }
                  min={0}
                  max={rows - 1}
                />
                <Input
                  type="number"
                  placeholder="Col"
                  value={detective.c}
                  onChange={(e) =>
                    updateDetective(i, "c", Math.max(0, Math.min(cols - 1, parseInt(e.target.value) || 0)))
                  }
                  min={0}
                  max={cols - 1}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={detective.hasKey}
                  onCheckedChange={(checked) => updateDetective(i, "hasKey", checked)}
                />
                <Label className="text-xs">Has Key 🔑</Label>
              </div>
            </Card>
          ))}
        </div>

        {/* Trophy Position */}
        <div className="space-y-2">
          <Label>Trophy Position 🏆</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Row"
              value={trophy.r}
              onChange={(e) =>
                setTrophy({ ...trophy, r: Math.max(0, Math.min(rows - 1, parseInt(e.target.value) || 0)) })
              }
              min={0}
              max={rows - 1}
            />
            <Input
              type="number"
              placeholder="Col"
              value={trophy.c}
              onChange={(e) =>
                setTrophy({ ...trophy, c: Math.max(0, Math.min(cols - 1, parseInt(e.target.value) || 0)) })
              }
              min={0}
              max={cols - 1}
            />
          </div>
        </div>

        {/* Locked Doors */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Locked Doors 🔒</Label>
            <Button size="sm" variant="outline" onClick={addLockedDoor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {lockedDoors.map((door, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="number"
                placeholder="Row"
                value={door.r}
                onChange={(e) =>
                  updateLockedDoor(i, "r", Math.max(0, Math.min(rows - 1, parseInt(e.target.value) || 0)))
                }
                min={0}
                max={rows - 1}
              />
              <Input
                type="number"
                placeholder="Col"
                value={door.c}
                onChange={(e) =>
                  updateLockedDoor(i, "c", Math.max(0, Math.min(cols - 1, parseInt(e.target.value) || 0)))
                }
                min={0}
                max={cols - 1}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeLockedDoor(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full font-bold" size="lg">
          🚀 Start Mission
        </Button>
      </CardContent>
    </Card>
  );
};
