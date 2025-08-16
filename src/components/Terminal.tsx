import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const Terminal = ({ isVisible, onClose }: TerminalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Code Editor Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type commands to interact with your code.',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    addLine('command', `$ ${command}`);
    
    const cmd = command.trim().toLowerCase();
    
    switch (cmd) {
      case 'clear':
        setLines([]);
        break;
      case 'help':
        addLine('output', 'Available commands:');
        addLine('output', '  clear  - Clear terminal');
        addLine('output', '  help   - Show this help');
        addLine('output', '  node   - Check Node.js version');
        addLine('output', '  python - Check Python version');
        addLine('output', '  g++    - Check C++ compiler');
        break;
      case 'node':
      case 'node --version':
        addLine('output', 'v18.17.0 (simulated)');
        break;
      case 'python':
      case 'python --version':
        addLine('output', 'Python 3.11.0 (simulated)');
        break;
      case 'g++':
      case 'g++ --version':
        addLine('output', 'g++ (simulated) 11.4.0');
        break;
      default:
        if (cmd.startsWith('echo ')) {
          addLine('output', command.substring(5));
        } else {
          addLine('error', `Command not found: ${command}`);
          addLine('output', 'Type "help" for available commands.');
        }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentInput.trim()) {
        executeCommand(currentInput);
        setCurrentInput("");
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="border-t border-sidebar-border bg-editor-bg">
      <div className="flex items-center justify-between p-2 border-b border-sidebar-border bg-tab-bg">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-tab-fg" />
          <span className="text-sm text-tab-fg">Terminal</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-3 bg-editor-bg font-mono text-sm"
      >
        {lines.map((line) => (
          <div 
            key={line.id} 
            className={`mb-1 ${
              line.type === 'command' 
                ? 'text-green-400' 
                : line.type === 'error' 
                  ? 'text-red-400' 
                  : 'text-editor-fg'
            }`}
          >
            {line.content}
          </div>
        ))}
        
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-0 outline-0 text-editor-fg"
            placeholder="Type a command..."
          />
        </div>
      </div>
    </div>
  );
};