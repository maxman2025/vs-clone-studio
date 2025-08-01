import { useState } from "react";
import { Files, Search, GitBranch, Settings, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const ActivityBar = ({ activeView, onViewChange }: ActivityBarProps) => {
  const items = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'source-control', icon: GitBranch, label: 'Source Control' },
    { id: 'extensions', icon: Code2, label: 'Extensions' },
  ];

  return (
    <div className="w-12 bg-activity-bg border-r border-sidebar-border flex flex-col">
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          className={`h-12 w-12 p-0 rounded-none hover:bg-activity-active/10 ${
            activeView === item.id 
              ? 'bg-activity-active/10 text-activity-active border-r-2 border-activity-active' 
              : 'text-activity-fg'
          }`}
          onClick={() => onViewChange(item.id)}
          title={item.label}
        >
          <item.icon className="h-6 w-6" />
        </Button>
      ))}
      
      <div className="mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="h-12 w-12 p-0 rounded-none hover:bg-activity-active/10 text-activity-fg"
          title="Settings"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};