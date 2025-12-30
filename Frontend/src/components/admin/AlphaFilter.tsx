import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlphaFilterProps {
    selectedLetter: string;
    onSelect: (letter: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphaFilter({ selectedLetter, onSelect }: AlphaFilterProps) {
    return (
        <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-md mb-4">
            <Button
                variant={selectedLetter === "" ? "default" : "ghost"}
                size="sm"
                className={cn("h-7 px-2 text-xs", selectedLetter === "" ? "bg-slate-900 text-white" : "text-slate-600")}
                onClick={() => onSelect("")}
            >
                All
            </Button>
            {ALPHABET.map((letter) => (
                <Button
                    key={letter}
                    variant={selectedLetter === letter ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-7 w-7 p-0 text-xs",
                        selectedLetter === letter ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    )}
                    onClick={() => onSelect(letter)}
                >
                    {letter}
                </Button>
            ))}
        </div>
    );
}
