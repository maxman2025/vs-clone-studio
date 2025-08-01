import { useState } from "react";
import { ChevronDown, ChevronRight, File, FolderOpen, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  activeFile: string;
  onFileSelect: (fileName: string, language: string) => void;
}

export const FileExplorer = ({ activeFile, onFileSelect }: FileExplorerProps) => {
  const [files] = useState<FileItem[]>([
    {
      id: 'workspace',
      name: 'WORKSPACE',
      type: 'folder',
      isOpen: true,
      children: [
        { id: 'main.js', name: 'main.js', type: 'file' },
        { id: 'main.cpp', name: 'main.cpp', type: 'file' },
        { id: 'script.py', name: 'script.py', type: 'file' },
      ]
    }
  ]);

  const getLanguageFromExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'cpp': return 'cpp';
      case 'py': return 'python';
      default: return 'plaintext';
    }
  };

  const renderFile = (file: FileItem, level: number = 0) => {
    const isActive = activeFile === file.name;
    
    return (
      <div key={file.id}>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start h-6 px-1 rounded-none text-xs hover:bg-sidebar-border ${
            isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-fg'
          }`}
          style={{ paddingLeft: `${8 + level * 12}px` }}
          onClick={() => {
            if (file.type === 'file') {
              onFileSelect(file.name, getLanguageFromExtension(file.name));
            }
          }}
        >
          {file.type === 'folder' ? (
            file.isOpen ? <FolderOpen className="h-3 w-3 mr-1" /> : <Folder className="h-3 w-3 mr-1" />
          ) : (
            <File className="h-3 w-3 mr-1" />
          )}
          <span className="truncate">{file.name}</span>
        </Button>
        
        {file.type === 'folder' && file.isOpen && file.children && (
          <div>
            {file.children.map(child => renderFile(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-sidebar-bg border-r border-sidebar-border">
      <div className="p-2 border-b border-sidebar-border">
        <h3 className="text-xs font-semibold text-sidebar-fg uppercase tracking-wider">Explorer</h3>
      </div>
      <div className="py-1">
        {files.map(file => renderFile(file))}
      </div>
    </div>
  );
};