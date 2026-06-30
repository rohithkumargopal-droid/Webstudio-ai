import React from 'react';
import { Layout, Share2, PanelLeftClose, Settings, Github, LogIn, LogOut, FolderOpen, Save } from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logout } from '../services/firebase';

interface HeaderProps {
  user: User | null;
  onSave: () => void;
  projectName?: string;
  onOpenProjects: () => void;
  projectsCount: number;
}

export default function Header({ user, onSave, projectName, onOpenProjects, projectsCount }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenProjects}
          className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors relative"
          title="My Projects"
        >
          <FolderOpen className="w-5 h-5" />
          {projectsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              {projectsCount}
            </span>
          )}
        </button>
        <div className="w-px h-6 bg-zinc-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 leading-tight">WebStudio AI</h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider line-clamp-1">
              {projectName || 'New Project'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-all">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
        <div className="w-px h-4 bg-zinc-200 mx-2" />
        
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-900">{user.displayName}</span>
              <button 
                onClick={logout}
                className="text-[9px] text-zinc-400 hover:text-red-500 transition-colors uppercase font-bold"
              >
                Sign Out
              </button>
            </div>
            <img 
              src={user.photoURL || ''} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-zinc-200"
            />
          </div>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-bold transition-all hover:bg-zinc-800"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}

        <div className="w-px h-4 bg-zinc-200 mx-2" />
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors">
          <Github className="w-4 h-4" />
        </button>
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm shadow-indigo-200">
          Export
        </button>
      </div>
    </header>
  );
}
