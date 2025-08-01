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

  const executeCpp = useCallback(async (code: string) => {
    setIsRunning(true);
    
    try {
      // Simulate C++ execution (in a real implementation, you'd use a C++ compiler)
      addOutput('log', 'C++ execution simulated (requires C++ compiler)');
      addOutput('log', `C++ code: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
      addOutput('result', 'In a real implementation, this would compile and execute C++ code using a web-based compiler.');
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
      case 'cpp':
        await executeCpp(code);
        break;
      case 'python':
        await executePython(code);
        break;
      default:
        addOutput('error', `Language ${language} not supported for execution`);
    }
  }, [executeJavaScript, executeCpp, executePython, addOutput]);

  return {
    output,
    isRunning,
    executeCode,
    clearOutput
  };
};