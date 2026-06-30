import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layout, Zap, Code, Shield, MousePointer2, ArrowRight, Github } from 'lucide-react';
import { loginWithGoogle } from '../services/firebase';
import { User } from 'firebase/auth';

interface LandingPageProps {
  onStart: () => void;
  user: User | null;
}

export default function LandingPage({ onStart, user }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">WebStudio AI</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Templates</a>
          {!user && (
            <button 
              onClick={loginWithGoogle}
              className="text-sm font-bold text-zinc-900 hover:bg-zinc-100 px-4 py-2 rounded-lg transition-all"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={onStart}
            className="bg-zinc-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-2"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Website Generation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-zinc-900 tracking-tight max-w-4xl leading-[1.1]"
          >
            Build your next website <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              in natural language
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 max-w-2xl leading-relaxed"
          >
            The world's most intuitive website generator. Just describe what you want, 
            and our AI crafts a production-ready interface in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 text-lg flex items-center gap-3 active:scale-95"
            >
              Start Generating
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 font-bold rounded-2xl hover:bg-zinc-50 transition-all text-lg active:scale-95">
              Watch Demo
            </button>
          </motion.div>

          {/* Abstract Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full pt-20 relative px-4"
          >
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-400/10 blur-[100px] rounded-full" />
            
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden aspect-video max-w-5xl mx-auto flex">
              {/* Fake Sidebar */}
              <div className="w-64 border-r border-zinc-100 p-6 flex flex-col gap-6">
                <div className="space-y-2">
                   <div className="h-4 w-24 bg-zinc-100 rounded-lg animate-pulse" />
                   <div className="h-10 w-full bg-zinc-50 rounded-xl" />
                </div>
                <div className="space-y-4 pt-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-6 h-6 bg-zinc-100 rounded-md" />
                      <div className="h-3 w-32 bg-zinc-50 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 bg-zinc-50/50 p-12 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
                   <Code className="w-8 h-8 text-indigo-600" />
                 </div>
                 <div className="h-8 w-64 bg-zinc-200/50 rounded-xl mb-4" />
                 <div className="h-4 w-96 bg-zinc-100 rounded-xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="bg-white border-t border-zinc-100 py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Instant Generation"
            description="Go from idea to production-ready HTML and CSS in less than 10 seconds."
          />
          <FeatureCard 
            icon={<MousePointer2 className="w-6 h-6 text-indigo-500" />}
            title="Interactive Preview"
            description="Real-time responsive previews for mobile, tablet, and desktop views."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-500" />}
            title="Clean Output"
            description="Our AI produces clean, semantic, and highly optimized code structure."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-8 bg-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale brightness-50 opacity-50">
             <Layout className="w-5 h-5 text-zinc-900" />
             <span className="font-bold text-zinc-900">WebStudio AI</span>
          </div>
          <p className="text-zinc-400 text-sm">© 2026 WebStudio AI. Built for the future of the web.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
