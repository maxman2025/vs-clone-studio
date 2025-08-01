import { useState, useCallback } from "react";

interface OutputItem {
  id: string;
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp: Date;
}

export const useCodeExecution = () => {
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addOutput = useCallback((type: OutputItem['type'], content: string) => {
    const newItem: OutputItem = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setOutput(prev => [...prev, newItem]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const executeJavaScript = useCallback(async (code: string) => {
    setIsRunning(true);
    
    try {
      // Create a console mock to capture output
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          logs.push(message);
          addOutput('log', message);
        },
        error: (...args: any[]) => {
          const message = args.map(arg => String(arg)).join(' ');
          logs.push(`ERROR: ${message}`);
          addOutput('error', `ERROR: ${message}`);
        },
        warn: (...args: any[]) => {
          const message = args.map(arg => String(arg)).join(' ');
          logs.push(`WARN: ${message}`);
          addOutput('log', `WARN: ${message}`);
        }
      };

      // Execute the code with the mock console
      const func = new Function('console', code);
      const result = func(mockConsole);
      
      // If there's a return value and no console output, show the result
      if (result !== undefined && logs.length === 0) {
        const resultStr = typeof result === 'object' 
          ? JSON.stringify(result, null, 2) 
          : String(result);
        addOutput('result', `Result: ${resultStr}`);
      }
      
    } catch (error) {
      addOutput('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [addOutput]);

  const executeHTML = useCallback(async (code: string) => {
    setIsRunning(true);
    
    try {
      // For HTML, we'll show a preview in the output
      addOutput('result', 'HTML code executed. Preview would appear in a real browser.');
      addOutput('log', `HTML content: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
    } catch (error) {
      addOutput('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [addOutput]);

  const executeCSS = useCallback(async (code: string) => {
    setIsRunning(true);
    
    try {
      addOutput('result', 'CSS code executed. Styles would be applied in a real browser.');
      addOutput('log', `CSS content: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
    } catch (error) {
      addOutput('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [addOutput]);

  const executePython = useCallback(async (code: string) => {
    setIsRunning(true);
    
    try {
      // Simulate Python execution (in a real implementation, you'd use a Python interpreter)
      addOutput('log', 'Python execution simulated (requires Python interpreter)');
      addOutput('log', `Python code: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
      addOutput('result', 'In a real implementation, this would execute Python code using a web-based interpreter like Pyodide.');
    } catch (error) {
      addOutput('error', `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [addOutput]);

  const executeCode = useCallback(async (code: string, language: string) => {
    if (!code.trim()) {
      addOutput('error', 'No code to execute');
      return;
    }

    switch (language) {
      case 'javascript':
        await executeJavaScript(code);
        break;
      case 'html':
        await executeHTML(code);
        break;
      case 'css':
        await executeCSS(code);
        break;
      case 'python':
        await executePython(code);
        break;
      default:
        addOutput('error', `Language ${language} not supported for execution`);
    }
  }, [executeJavaScript, executeHTML, executeCSS, executePython, addOutput]);

  return {
    output,
    isRunning,
    executeCode,
    clearOutput
  };
};