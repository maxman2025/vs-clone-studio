import { useState, useEffect } from "react";
import { ActivityBar } from "@/components/ActivityBar";
import { FileExplorer } from "@/components/FileExplorer";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { StatusBar } from "@/components/StatusBar";
import { useCodeExecution } from "@/hooks/useCodeExecution";

const Index = () => {
  const [activeView, setActiveView] = useState('explorer');
  const [activeFile, setActiveFile] = useState('main.js');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to VS Code Editor!
// This editor runs code in your browser without needing a server.

console.log("Hello, World!");

// Try some variables
const message = "JavaScript is running!";
console.log(message);

// Try some math
const result = 2 + 3 * 4;
console.log("2 + 3 * 4 =", result);

// Try an array
const fruits = ["apple", "banana", "orange"];
console.log("Fruits:", fruits);

// Return a value to see the result
fruits.length;`);
  
  const [outputVisible, setOutputVisible] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  const { output, isRunning, executeCode, clearOutput } = useCodeExecution();

  const fileTemplates = {
    'main.js': `// Welcome to VS Code Editor!
// This editor runs code in your browser without needing a server.

console.log("Hello, World!");

// Try some variables
const message = "JavaScript is running!";
console.log(message);

// Try some math
const result = 2 + 3 * 4;
console.log("2 + 3 * 4 =", result);

// Try an array
const fruits = ["apple", "banana", "orange"];
console.log("Fruits:", fruits);

// Return a value to see the result
fruits.length;`,
    
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello, HTML World!</h1>
    <p>This is a sample HTML file.</p>
    <button onclick="alert('Button clicked!')">Click me!</button>
</body>
</html>`,
    
    'style.css': `/* CSS Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`,
    
    'script.py': `# Python Script
# Note: This is a simulation - real Python execution would require a Python interpreter

print("Hello, Python World!")

# Variables
name = "Python Developer"
age = 25

print(f"Name: {name}, Age: {age}")

# Lists
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]

print("Numbers:", numbers)
print("Squared:", squared)

# Function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci(8):", fibonacci(8))`
  };

  const handleFileSelect = (fileName: string, language: string) => {
    setActiveFile(fileName);
    setCurrentLanguage(language);
    
    // Load the template for this file
    if (fileName in fileTemplates) {
      setCode(fileTemplates[fileName as keyof typeof fileTemplates]);
    }
  };

  const handleRun = () => {
    if (!outputVisible) setOutputVisible(true);
    executeCode(code, currentLanguage);
  };

  // Calculate cursor position from textarea
  useEffect(() => {
    const lines = code.split('\n');
    setCursorPosition({ line: lines.length, column: lines[lines.length - 1]?.length + 1 || 1 });
  }, [code]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Main layout */}
      <div className="flex-1 flex">
        {/* Activity Bar */}
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
        
        {/* Sidebar */}
        {activeView === 'explorer' && (
          <FileExplorer 
            activeFile={activeFile} 
            onFileSelect={handleFileSelect}
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <CodeEditor
            value={code}
            onChange={setCode}
            language={currentLanguage}
            onRun={handleRun}
            isRunning={isRunning}
          />
          
          {/* Output Panel */}
          <OutputPanel
            output={output}
            onClear={clearOutput}
            isVisible={outputVisible}
            onClose={() => setOutputVisible(false)}
          />
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar
        language={currentLanguage}
        line={cursorPosition.line}
        column={cursorPosition.column}
        isRunning={isRunning}
      />
    </div>
  );
};

export default Index;
