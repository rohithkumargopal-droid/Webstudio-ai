/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import { auth, db } from './services/firebase';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import LandingPage from './components/LandingPage';
import { Message, GeneratorState, Project } from './types';

const SYSTEM_INSTRUCTION = `You are a world-class frontend web developer. 
Your task is to generate beautiful, modern, and responsive websites based on user descriptions.

CRITICAL GUIDELINES:
1. Output ONLY the code, contained within a single self-contained HTML file.
2. Include all CSS (inside <style>) and Javascript (inside <script>) within that single file.
3. Use modern, high-quality aesthetics:
   - Typography: Use Inter or system-sans as primary fonts.
   - Spacing: Use ample white space and consistent padding.
   - Color: Use sophisticated color palettes (e.g., zinc/slate for neutrals).
   - Icons: Use Lucide-inspired SVG patterns or standard FontAwesome-like placeholders if external CDN is used (preferably SVG for self-containment).
4. Do NOT include any explanations, markdown markers like \`\`\`html, or conversational filler. Output ONLY the raw HTML string.
5. Ensure the code is responsive (mobile-friendly).
6. If the user asks for a change, provide the ENTIRE updated HTML code.

Example output:
<!DOCTYPE html>
<html>
<head>...style...</head>
<body>...content...</body>
</html>`;

export default function App() {
  const [view, setView] = useState<'landing' | 'builder'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const [state, setState] = useState<GeneratorState>({
    code: '',
    messages: [
      {
        role: 'assistant',
        content: 'Hi! I\'m your WebStudio AI. Tell me what kind of website you want to build and I\'ll generate it for you instantly.',
        isInitial: true
      }
    ],
    status: 'idle'
  });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Auth sync
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchProjects(u.uid);
      } else {
        setProjects([]);
        setCurrentProject(null);
      }
    });
  }, []);

  const fetchProjects = async (uid: string) => {
    try {
      const q = query(
        collection(db, "projects"), 
        where("userId", "==", uid),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const loadedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(loadedProjects);
    } catch (e) {
      console.error("Error fetching projects:", e);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please sign in to save your projects.");
      return;
    }

    const name = prompt("Enter project name:", currentProject?.name || "My New Website");
    if (!name) return;
    
    try {
      if (currentProject) {
        // Update existing
        const projectRef = doc(db, "projects", currentProject.id);
        await updateDoc(projectRef, {
          name,
          code: state.code,
          updatedAt: serverTimestamp()
        });
        setCurrentProject({ ...currentProject, name, code: state.code });
      } else {
        // Create new
        const docRef = await addDoc(collection(db, "projects"), {
          name,
          code: state.code,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setCurrentProject({ 
          id: docRef.id, 
          name, 
          code: state.code, 
          userId: user.uid, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        } as Project);
      }
      await fetchProjects(user.uid);
    } catch (e) {
      console.error("Save error:", e);
      alert("Failed to save project. Check console for details.");
    }
  };

  const loadProject = (project: Project) => {
    setCurrentProject(project);
    setState(prev => ({
      ...prev,
      code: project.code,
      messages: [
        ...prev.messages,
        { role: 'assistant', content: `Loaded project: ${project.name}` }
      ]
    }));
    setIsProjectsOpen(false);
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { role: 'user', content: text };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      status: 'generating'
    }));

    try {
      const chatContext = state.messages
        .filter(m => !m.isInitial)
        .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n');
      
      const prompt = `Current code:
${state.code || 'None (Initial Step)'}

Chat history:
${chatContext}

New Request:
${text}

Generate the updated full HTML code:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const generatedCode = response.text || '';
      const cleanCode = generatedCode.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

      setState(prev => ({
        ...prev,
        code: cleanCode,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: 'Website updated! Check out the preview on the right.' }
        ],
        status: 'idle'
      }));
    } catch (error) {
      console.error('Generation failed:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        messages: [
          ...prev.messages,
          { role: 'assistant', content: 'Sorry, I encountered an error while generating your website. Please try again.' }
        ]
      }));
    }
  };

  const clearChat = () => {
    setState({
      code: '',
      messages: [
        {
          role: 'assistant',
          content: 'Hi! I\'m your WebStudio AI. Tell me what kind of website you want to build and I\'ll generate it for you instantly.',
          isInitial: true
        }
      ],
      status: 'idle'
    });
    setCurrentProject(null);
  };

  return (
    <div className="h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStart={() => setView('builder')} user={user} />
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full"
          >
            <Header 
              user={user} 
              onSave={handleSave} 
              projectName={currentProject?.name}
              onOpenProjects={() => setIsProjectsOpen(!isProjectsOpen)}
              projectsCount={projects.length}
            />
            <main className="flex flex-1 overflow-hidden relative">
              <ChatPanel 
                messages={state.messages} 
                onSendMessage={handleSendMessage} 
                status={state.status}
                onClear={clearChat}
              />
              <PreviewPanel 
                code={state.code} 
                isInitial={state.code === ''} 
              />

              {/* Projects Sidebar Overlay */}
              {isProjectsOpen && (
                <div className="absolute inset-y-0 left-0 w-80 bg-white border-r border-zinc-200 shadow-2xl z-20 flex flex-col animate-in slide-in-from-left duration-300">
                  <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                    <h2 className="font-bold text-zinc-900">Your Projects</h2>
                    <button 
                      onClick={() => setIsProjectsOpen(false)}
                      className="text-zinc-400 hover:text-zinc-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {projects.length === 0 ? (
                      <p className="text-sm text-zinc-500 text-center py-8">No saved projects yet</p>
                    ) : (
                      projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => loadProject(p)}
                          className={`w-full text-left p-3 rounded-lg transition-colors group ${
                            currentProject?.id === p.id 
                              ? "bg-indigo-50 border border-indigo-100" 
                              : "hover:bg-zinc-50"
                          }`}
                        >
                          <p className={`text-sm font-medium ${currentProject?.id === p.id ? "text-indigo-700" : "text-zinc-700"}`}>
                            {p.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">
                            Updated {new Date(p.updatedAt?.seconds * 1000).toLocaleDateString()}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

