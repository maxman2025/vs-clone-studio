import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onFindNext: () => void;
  onFindPrevious: () => void;
  onClose: () => void;
  matches?: number;
  currentMatch?: number;
}

export const SearchPanel = ({ 
  onSearch, 
  onFindNext, 
  onFindPrevious, 
  onClose, 
  matches = 0, 
  currentMatch = 0 
}: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-tab-bg border-b border-tab-border">
      <div className="flex items-center gap-1 flex-1">
        <Search className="h-4 w-4 text-tab-fg" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search in file..."
          className="h-7 text-sm bg-editor-bg border-sidebar-border text-editor-fg"
          autoFocus
        />
        <span className="text-xs text-tab-fg min-w-fit">
          {matches > 0 ? `${currentMatch}/${matches}` : '0/0'}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onFindPrevious}
          disabled={matches === 0}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onFindNext}
          disabled={matches === 0}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};