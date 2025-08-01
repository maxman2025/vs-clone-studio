import { useEffect, useRef } from "react";
import { X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputItem {
  id: string;
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp: Date;
}

interface OutputPanelProps {
  output: OutputItem[];
  onClear: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export const OutputPanel = ({ output, onClear, isVisible, onClose }: OutputPanelProps) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  if (!isVisible) return null;

  return (
    <div className="h-64 bg-output-bg border-t border-sidebar-border flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-sidebar-border bg-tab-bg">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-tab-fg" />
          <span className="text-sm text-tab-fg">Output</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={onClear}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-3 font-mono text-sm"
      >
        {output.length === 0 ? (
          <div className="text-output-fg/50 italic">No output yet. Run some code to see results here.</div>
        ) : (
          output.map((item) => (
            <div key={item.id} className={`mb-1 ${
              item.type === 'error' ? 'text-output-error' : 
              item.type === 'result' ? 'text-output-success' : 
              'text-output-fg'
            }`}>
              <span className="text-output-fg/50 text-xs mr-2">
                {item.timestamp.toLocaleTimeString()}
              </span>
              {item.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
};