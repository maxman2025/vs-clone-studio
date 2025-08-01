import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onRun: () => void;
  isRunning: boolean;
}

export const CodeEditor = ({ value, onChange, language, onRun, isRunning }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [value]);

  const applySyntaxHighlighting = (code: string) => {
    if (language !== 'javascript') return code;
    
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="syntax-string">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>')
      .replace(/\b(\w+)(?=\s*\()/g, '<span class="syntax-function">$1</span>');
  };

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      <div className="flex items-center justify-between p-2 border-b border-tab-border bg-tab-bg">
        <span className="text-sm text-tab-fg">main.{language === 'javascript' ? 'js' : language}</span>
        <Button
          onClick={onRun}
          disabled={isRunning}
          size="sm"
          className="h-7 px-3"
        >
          {isRunning ? (
            <>
              <Square className="h-3 w-3 mr-1" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Run
            </>
          )}
        </Button>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Line numbers */}
          <div className="line-numbers bg-editor-line text-editor-fg text-right py-3 px-2 text-sm font-mono leading-5 border-r border-sidebar-border">
            {lineNumbers.map((num) => (
              <div key={num} className="h-5">
                {num}
              </div>
            ))}
          </div>
          
          {/* Editor */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Write your ${language} code here...`}
              className="code-editor absolute inset-0 resize-none border-0 bg-editor-bg text-editor-fg p-3 pl-4 rounded-none focus:ring-0 focus:ring-offset-0 leading-5"
              style={{
                fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '20px',
                minHeight: '100%',
                height: '100%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};