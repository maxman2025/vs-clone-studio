import { Code2, GitBranch, Info } from "lucide-react";

interface StatusBarProps {
  language: string;
  line: number;
  column: number;
  isRunning: boolean;
}

export const StatusBar = ({ language, line, column, isRunning }: StatusBarProps) => {
  return (
    <div className="h-6 bg-status-bg text-status-fg text-xs flex items-center justify-between px-3">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Info className="h-3 w-3" />
          <span>{isRunning ? 'Running...' : 'Ready'}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Code2 className="h-3 w-3" />
          <span className="capitalize">{language}</span>
        </div>
        
        <div>
          Ln {line}, Col {column}
        </div>
      </div>
    </div>
  );
};