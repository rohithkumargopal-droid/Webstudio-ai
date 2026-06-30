import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Code, Eye, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
// Import plugins if needed, but we can also handle line numbers via a CSS trick or manual mapping
import { cn } from '../lib/utils';

interface PreviewPanelProps {
  code: string;
  isInitial: boolean;
}

type ViewMode = 'preview' | 'code';
type DeviceSize = 'desktop' | 'tablet' | 'mobile';

export default function PreviewPanel({ code, isInitial }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (viewMode === 'code') {
      Prism.highlightAll();
    }
  }, [code, viewMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const reloadPreview = () => setKey(prev => prev + 1);

  if (isInitial && !code) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Build your website with AI</h1>
          <p className="text-zinc-500">
            Tell the chat assistant what kind of website you want to build. You can describe the layout, features, colors, and content.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3 bg-zinc-50 rounded-lg text-xs text-zinc-600 border border-zinc-100 text-left">
              "Create a dark themed portfolio for a photographer"
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg text-xs text-zinc-600 border border-zinc-100 text-left">
              "Create a landing page for a coffee shop"
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-100 overflow-hidden">
      <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              viewMode === 'preview' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              viewMode === 'code' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        {viewMode === 'preview' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDeviceSize('desktop')}
              className={cn(
                "p-2 rounded-md transition-colors",
                deviceSize === 'desktop' ? "bg-zinc-100 text-indigo-600" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceSize('tablet')}
              className={cn(
                "p-2 rounded-md transition-colors",
                deviceSize === 'tablet' ? "bg-zinc-100 text-indigo-600" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceSize('mobile')}
              className={cn(
                "p-2 rounded-md transition-colors",
                deviceSize === 'mobile' ? "bg-zinc-100 text-indigo-600" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
           <button 
             onClick={reloadPreview}
             className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
             title="Reload Preview"
           >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div 
          className={cn(
            "h-full mx-auto transition-all duration-300",
            viewMode === 'preview' ? "bg-white shadow-xl" : "hidden"
          )}
          style={{ width: deviceWidths[deviceSize] }}
        >
          <iframe
            key={key}
            title="Preview"
            srcDoc={code || '<html><body><div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; color: #888;">Generating preview...</div></body></html>'}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-forms allow-modals"
          />
        </div>

        {viewMode === 'code' && (
          <div className="h-full bg-zinc-900 overflow-hidden flex flex-col relative group">
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-md border border-zinc-700 text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-zinc-900">
              <div className="flex min-h-full">
                {/* Line Numbers */}
                <div className="p-6 pr-4 text-right bg-zinc-900/50 border-r border-zinc-800 select-none sticky left-0 z-0">
                  {code.split('\n').map((_, i) => (
                    <div key={i} className="text-zinc-600 text-xs font-mono h-[1.25rem] leading-[1.25rem]">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Code Body */}
                <pre className="p-6 pl-4 text-sm bg-transparent m-0 flex-1">
                  <code className="language-markup block leading-[1.25rem]">
                    {code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
