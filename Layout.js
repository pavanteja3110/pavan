
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  LayoutDashboard, 
  Upload, 
  BarChart3,
  Target,
  Users,
  Sparkles,
  Briefcase,
  LogOut,
  LogIn
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User, Resume, Evaluation } from "@/entities/all";
import { Button } from "@/components/ui/button";
import Chatbot from "@/components/chatbot/Chatbot";
import ChatbotFAB from "@/components/chatbot/ChatbotFAB";
import ParticleBackground from "@/components/ui/ParticleBackground";
import FloatingElements from "@/components/ui/FloatingElements";
import MorphingBlob from "@/components/ui/MorphingBlob";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Upload & Compare",
    url: createPageUrl("Upload"),
    icon: Upload,
  },
];

const managementItems = [
  {
    title: "Manage Resumes",
    url: createPageUrl("ManageResumes"),
    icon: Users,
  },
  {
    title: "Manage Jobs",
    url: createPageUrl("ManageJobDescriptions"),
    icon: Briefcase,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [stats, setStats] = useState({ resumeCount: 0, avgScore: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Safely try to fetch data with proper error handling
        const [resumes, evaluations] = await Promise.all([
          Resume.list().catch(() => []), // Return empty array if fails
          Evaluation.list().catch(() => []) // Return empty array if fails
        ]);
        
        const avgScore = evaluations.length > 0
          ? evaluations.reduce((sum, ev) => sum + (ev.relevance_score || 0), 0) / evaluations.length
          : 0;
          
        setStats({
          resumeCount: resumes.length,
          avgScore: avgScore
        });
      } catch (error) {
        console.warn("Could not fetch stats, using defaults:", error);
        setStats({ resumeCount: 0, avgScore: 0 });
      }
    };

    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
        console.log("User not logged in");
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchStats();
    fetchUser();
    
    // refetch stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const pageVariants = {
    initial: { opacity: 0, x: -20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.98 }
  };

  const pageTransition = {
    type: "tween",
    duration: 0.4,
    ease: "easeOut"
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-50: #f8fafc;
          --primary-100: #f1f5f9;
          --primary-200: #e2e8f0;
          --primary-500: #64748b;
          --primary-600: #475569;
          --primary-700: #334155;
          --primary-800: #1e293b;
          --primary-900: #0f172a;
          --accent-500: #3b82f6;
          --accent-600: #2563eb;
          --success-500: #10b981;
          --warning-500: #f59e0b;
          --danger-500: #ef4444;
        }
        
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          overflow-x: hidden;
        }
        
        .sidebar-gradient {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 
                      0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        
        .glass-effect {
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
        
        .glass-effect-dark {
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          to { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(168, 85, 247, 0.3); }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      
      <ParticleBackground />
      <FloatingElements />
      
      <div className="min-h-screen flex w-full relative z-20">
        {/* Morphing Background Blobs */}
        <MorphingBlob className="w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 -top-48 -left-48 z-0" />
        <MorphingBlob className="w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-600/20 -bottom-40 -right-40 z-0" />
        
        <Sidebar className="border-none sidebar-gradient relative z-30">
          <SidebarHeader className="border-b border-white/10 p-6 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="w-12 h-12 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-glow"
              >
                <Target className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="font-bold text-white text-xl gradient-text">ResumeCheck</h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-blue-200 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Evaluation
                </motion.p>
              </div>
            </motion.div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 relative z-10">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-3">
                Main Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-white/10 text-white hover:text-blue-200 transition-all duration-300 rounded-xl mb-1 group relative overflow-hidden ${
                            location.pathname === item.url ? 'bg-white/10 text-blue-200 shadow-lg' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3 relative z-10">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <item.icon className="w-5 h-5" />
                            </motion.div>
                            <span className="font-medium">{item.title}</span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100"
                              initial={false}
                              animate={{ opacity: location.pathname === item.url ? 0.5 : 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-3">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                 <SidebarMenu className="space-y-2">
                  {managementItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.5 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-white/10 text-white hover:text-blue-200 transition-all duration-300 rounded-xl mb-1 group relative overflow-hidden ${
                            location.pathname === item.url ? 'bg-white/10 text-blue-200 shadow-lg' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3 relative z-10">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <item.icon className="w-5 h-5" />
                            </motion.div>
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2 space-y-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 text-sm text-blue-100 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-300" />
                    <span>Total Resumes</span>
                    <motion.span 
                      className="ml-auto font-bold"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stats.resumeCount}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 text-sm text-blue-100 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    <span>Avg Score</span>
                    <motion.span 
                      className="ml-auto font-bold text-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      {stats.avgScore.toFixed(1)}%
                    </motion.span>
                  </motion.div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-6 relative z-10">
            { !isLoadingUser && (
              currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <motion.div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <Users className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{currentUser.full_name}</p>
                    <p className="text-xs text-blue-200 truncate">{currentUser.email}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLogout} className="text-blue-200 hover:text-white">
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <LogIn className="w-4 h-4 mr-2" />
                    Placement Team Login
                  </Button>
                </motion.div>
              )
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col relative z-30">
          <header className="glass-effect border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-blue-100/50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold gradient-text">ResumeCheck</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        <ChatbotFAB onClick={() => setIsChatbotOpen(true)} />
      </div>
    </SidebarProvider>
  );
}
