import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixBackground } from './MatrixBackground';
import CONFIG from '../config';

interface OutputLine {
  id: string;
  text: string;
  type: 'system' | 'prompt' | 'command' | 'output' | 'error' | 'remark' | 'success' | 'ascii';
  delay?: number;
  hoverable?: boolean;
  copyable?: boolean;
}

const ASCII_ART = [
  '    __ __                                ',
  '   / //_/____ _ _____ __  __ ____   __  ____ _',
  '  / ,<  / __ `// ___// / / // __ \\ / / / / __ `/',
  ' / /| |/ /_/ // /   / /_/ // / / // /_/ / /_/ /',
  '/_/ |_|\\__,_//_/    \\__,_//_/ /_/ \\__, /\\__,_/',
  '                                 /____/',
  '',
  'KARUNYA MUDDANA — Backend & AI Developer',
  '',
];

export function InteractiveCLI() {
  const [bootComplete, setBootComplete] = useState(false);
  const [asciiComplete, setAsciiComplete] = useState(false);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRoot, setIsRoot] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [screenDim, setScreenDim] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'connecting' | 'offline'>('offline');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cinematic boot sequence with deliberate timing
  useEffect(() => {
    const bootSequence = async () => {
      const bootLines = [
        { id: '1', text: 'system initializing...', type: 'system' as const, delay: 0 },
        { id: '2', text: 'bios check: OK', type: 'success' as const, delay: 1400 },
        { id: '3', text: 'neural modules: active', type: 'success' as const, delay: 2600 },
        { id: '4', text: `user: ${CONFIG.SYSTEM.DEVELOPER.replace(' ', '_')}`, type: 'system' as const, delay: 3900 },
        { id: '5', text: 'access granted.', type: 'success' as const, delay: 5200 },
        { id: '6', text: '', type: 'system' as const, delay: 6400 },
      ];

      bootLines.forEach((line) => {
        setTimeout(() => {
          setOutputLines((prev) => [...prev, line]);
        }, line.delay);
      });

      setTimeout(() => {
        setBootComplete(true);
        printASCIIArt();
      }, CONFIG.TIMING.BOOT_SEQUENCE);
    };

    bootSequence();
  }, []);

  // Print ASCII art with dramatic line-by-line reveal
  const printASCIIArt = async () => {
    for (const line of ASCII_ART) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setOutputLines((prev) => [
            ...prev,
            { id: Date.now().toString() + Math.random(), text: line, type: 'ascii' },
          ]);
          resolve(null);
        }, CONFIG.TIMING.ASCII_LINE_DELAY);
      });
    }
    
    await new Promise((resolve) => setTimeout(resolve, 600));
    setAsciiComplete(true);
    executeCommand('help', true);
  };

  // Slower cursor pulse (1.2s cycle) with cinematic fade
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, CONFIG.TIMING.CURSOR_PULSE);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [outputLines]);

  // Focus input when clicking anywhere
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const addLine = (text: string, type: OutputLine['type'] = 'output', hoverable = false, copyable = false) => {
    setOutputLines((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), text, type, hoverable, copyable },
    ]);
  };

  // Cinematic character-by-character typing with variable timing (50-60ms)
  const typeCharByChar = async (text: string, type: OutputLine['type'] = 'output') => {
    let currentText = '';
    const lineId = Date.now().toString() + Math.random();
    
    setOutputLines((prev) => [
      ...prev,
      { id: lineId, text: '', type },
    ]);

    for (const char of text) {
      currentText += char;
      await new Promise((resolve) => {
        const delay = CONFIG.TIMING.CHAR_TYPE_MIN + Math.random() * (CONFIG.TIMING.CHAR_TYPE_MAX - CONFIG.TIMING.CHAR_TYPE_MIN);
        setTimeout(() => {
          setOutputLines((prev) =>
            prev.map((line) =>
              line.id === lineId ? { ...line, text: currentText } : line
            )
          );
          resolve(null);
        }, delay);
      });
    }

    await new Promise((resolve) => setTimeout(resolve, CONFIG.TIMING.LINE_SPACING));
  };

  const typeOutLines = async (
    lines: Array<{ text: string; type?: OutputLine['type']; hoverable?: boolean; copyable?: boolean; typed?: boolean }>,
    baseDelay = 100
  ) => {
    for (const line of lines) {
      if (line.typed) {
        await typeCharByChar(line.text, line.type || 'output');
      } else {
        await new Promise((resolve) => {
          setTimeout(() => {
            addLine(line.text, line.type || 'output', line.hoverable, line.copyable);
            resolve(null);
          }, baseDelay);
        });
      }
    }
  };

  const handleAIQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsAiThinking(true);
    setScreenDim(true);
    
    await typeOutLines([
      { text: '' },
      { text: '[ai note]: processing query...', type: 'system' },
      { text: '[system remark]: awaiting cognitive response.', type: 'remark' },
    ], 100);

    // Simulate neural processing delay
    const thinkingDelay = CONFIG.TIMING.AI_THINKING_MIN + Math.random() * (CONFIG.TIMING.AI_THINKING_MAX - CONFIG.TIMING.AI_THINKING_MIN);
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    try {
      if (connectionStatus === 'online') {
        setConnectionStatus('connecting');
        
        const response = await fetch(CONFIG.BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        setConnectionStatus('online');
        setScreenDim(false);
        setIsAiThinking(false);

        await typeOutLines([{ text: '' }], 50);
        await typeCharByChar(data.response, 'output');
        
        const remarks = [
          '[system remark]: cognitive load stable.',
          '[ai note]: insight protocol complete.',
          '[system remark]: neural pathways optimized.',
          '[ai note]: response synthesis successful.',
        ];
        const randomRemark = remarks[Math.floor(Math.random() * remarks.length)];
        
        await typeOutLines([
          { text: '' },
          { text: randomRemark, type: 'remark' },
          { text: '' },
        ], 100);
      } else {
        throw new Error('Backend offline');
      }
    } catch (error) {
      setConnectionStatus('offline');
      setScreenDim(false);
      setIsAiThinking(false);
      
      const simulatedResponses = [
        "I'm currently operating in offline mode. For full AI capabilities, the backend needs to be accessible.",
        "Connection to the neural network is unstable. Please check the backend status at flask-1yw5.onrender.com",
        "Backend connection lost. Running in local simulation mode with limited capabilities.",
      ];
      const simulatedResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      
      await typeOutLines([
        { text: '' },
        { text: '[error]: connection unstable. reinitializing link...', type: 'error' },
      ], 100);
      await typeCharByChar(simulatedResponse, 'output');
      await typeOutLines([
        { text: '' },
        { text: '[system remark]: attempting reconnection on next query.', type: 'remark' },
        { text: '' },
      ], 100);
    }
  };

  const executeCommand = async (cmd: string, silent = false) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Voltage dip effect on command input
    if (!silent) {
      setScreenDim(true);
      setTimeout(() => setScreenDim(false), CONFIG.TIMING.VOLTAGE_DIP);
      addLine(`${isRoot ? 'Karunya@root:/$' : aiMode ? 'Karunya@ai_agent:~$' : 'Karunya@terminal:~$'} ${cmd}`, 'command');
      setCommandHistory((prev) => [...prev, cmd]);
    }

    if (!trimmedCmd) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (trimmedCmd) {
      case 'help':
        await typeOutLines([
          { text: '' },
          { text: 'Available commands:' },
          { text: '  > about      - Display profile information' },
          { text: '  > projects   - List featured projects' },
          { text: '  > skills     - Show technical stack' },
          { text: '  > contact    - Get contact information' },
          { text: '  > run ai_agent - Activate AI multi-agent system' },
          { text: '  > exit_ai    - Deactivate AI mode' },
          { text: '  > clear      - Clear terminal screen' },
          { text: '  > exit       - Close session' },
          { text: '' },
          { text: "[tip]: try 'run ai_agent' to talk with Karunya's AI.", type: 'remark' },
          { text: '' },
        ], 120);
        break;

      case 'about':
        await typeOutLines([{ text: '[retrieving profile...]', type: 'system' }], 100);
        await new Promise((resolve) => setTimeout(resolve, 800));
        await typeOutLines([
          { text: '' },
          { text: `Name: ${CONFIG.SYSTEM.DEVELOPER}`, typed: true },
          { text: `Role: ${CONFIG.SYSTEM.ROLE}`, typed: true },
          { text: `Location: ${CONFIG.SYSTEM.LOCATION}`, typed: true },
          { text: '' },
        ], 80);
        await typeOutLines([
          { text: 'Focus: Autonomous Multi-Agent Systems, AI pipelines, backend architecture.' },
          { text: '' },
          { text: 'I specialize in building intelligent backend systems that blend data, logic,' },
          { text: 'and automation. My work centers on multi-agent AI architectures, RAG pipelines,' },
          { text: 'and robust data processing tools using Python.' },
          { text: '' },
          { text: '[system remark]: curious focus detected. optimization potential: 97%.', type: 'remark' },
          { text: '[system remark]: cognitive load stable.', type: 'remark' },
          { text: '' },
        ], 100);
        break;

      case 'projects':
        await typeOutLines([{ text: '[fetching active repositories...]', type: 'system' }], 100);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await typeOutLines([{ text: '[ai note]: command recognized. deploying insight protocol.', type: 'remark' }], 120);
        await new Promise((resolve) => setTimeout(resolve, 800));
        await typeOutLines([
          { text: '' },
          { text: '★ Autonomous Multi-Agent Research Pipeline', hoverable: true },
          { text: '   Agents: Research → Argus → Critic' },
          { text: '   Description: 3-agent pipeline generating citation-backed research briefs' },
          { text: '                using RAG and iterative generator–critic loops.' },
          { text: '   Stack: Python | RAG | ArXiv API | SQLite' },
          { text: '   Status: Active', type: 'success' },
          { text: '' },
          { text: '★ Argus — Persona-Driven Writer Agent', hoverable: true },
          { text: '   Description: LLM-based writing agent with revision-reporting system.' },
          { text: '   Stack: Prompt Engineering | System Personas' },
          { text: '   Status: Deployed', type: 'success' },
          { text: '' },
          { text: '★ Critic Agent & Generator–Critic Loop', hoverable: true },
          { text: '   Description: Adversarial evaluation agent to reduce hallucination.' },
          { text: '   Stack: Python | Evaluation Heuristics' },
          { text: '   Status: Research', type: 'remark' },
          { text: '' },
          { text: '★ License Plate Detector (CV)', hoverable: true },
          { text: '   Stack: OpenCV | Tesseract | SQLite' },
          { text: '   Status: Stable', type: 'success' },
          { text: '' },
          { text: '★ CBSE Marks Analyzer', hoverable: true },
          { text: '   Stack: Pandas | Matplotlib | Excel' },
          { text: '   Status: Completed', type: 'success' },
          { text: '' },
          { text: '[system remark]: 5 repositories operational.', type: 'remark' },
          { text: '' },
        ], 90);
        break;

      case 'skills':
        await typeOutLines([{ text: '[loading technical stack...]', type: 'system' }], 100);
        await new Promise((resolve) => setTimeout(resolve, 700));
        await typeOutLines([
          { text: '' },
          { text: 'Languages:' },
          { text: '  • Python (primary)', hoverable: true },
          { text: '' },
          { text: 'AI / Machine Learning:' },
          { text: '  • RAG (Retrieval-Augmented Generation)', hoverable: true },
          { text: '  • Multi-Agent Systems', hoverable: true },
          { text: '  • LLM Integration', hoverable: true },
          { text: '  • Model Evaluation & Orchestration', hoverable: true },
          { text: '' },
          { text: 'Backend:' },
          { text: '  • FastAPI', hoverable: true },
          { text: '  • SQL / SQLite', hoverable: true },
          { text: '  • RESTful APIs', hoverable: true },
          { text: '  • Authentication Systems', hoverable: true },
          { text: '' },
          { text: 'Data & Computer Vision:' },
          { text: '  • Pandas', hoverable: true },
          { text: '  • OpenCV', hoverable: true },
          { text: '  • Tesseract OCR', hoverable: true },
          { text: '' },
          { text: 'Tools:' },
          { text: '  • Docker', hoverable: true },
          { text: '  • Git', hoverable: true },
          { text: '  • Linux / Unix', hoverable: true },
          { text: '' },
          { text: '[system remark]: impressive stack. backend neurons firing at 94% capacity.', type: 'remark' },
          { text: '' },
        ], 80);
        break;

      case 'contact':
        await typeOutLines([{ text: '[retrieving contact info...]', type: 'system' }], 100);
        await new Promise((resolve) => setTimeout(resolve, 600));
        await typeOutLines([
          { text: '' },
          { text: `Email: ${CONFIG.CONTACT.EMAIL}`, copyable: true },
          { text: `GitHub: ${CONFIG.CONTACT.GITHUB}`, copyable: true },
          { text: `LinkedIn: ${CONFIG.CONTACT.LINKEDIN}`, copyable: true },
          { text: `Location: ${CONFIG.SYSTEM.LOCATION}` },
          { text: '' },
          { text: '[system remark]: transmission channels ready.', type: 'remark' },
          { text: '' },
        ], 100);
        break;

      case 'clear':
        setOutputLines([]);
        setIsProcessing(false);
        return;

      case 'exit':
        await typeOutLines([
          { text: '' },
          { text: 'Closing session...', type: 'system' },
          { text: '' },
        ], 300);
        
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const asciiLines = ASCII_ART.map((line, i) => ({
          id: 'exit-' + i,
          text: line,
          type: 'ascii' as const,
        }));
        setOutputLines(asciiLines);
        
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setOutputLines([]);
        setIsRoot(false);
        
        setTimeout(() => {
          setBootComplete(false);
          setAsciiComplete(false);
          setTimeout(() => {
            const bootLines = [
              { id: Date.now() + '1', text: 'system initializing...', type: 'system' as const },
              { id: Date.now() + '2', text: 'bios check: OK', type: 'success' as const },
              { id: Date.now() + '3', text: 'neural modules: active', type: 'success' as const },
              { id: Date.now() + '4', text: 'user: Karunya_Muddana', type: 'system' as const },
              { id: Date.now() + '5', text: 'access granted.', type: 'success' as const },
              { id: Date.now() + '6', text: '', type: 'system' as const },
            ];
            setOutputLines(bootLines);
            setBootComplete(true);
            printASCIIArt();
          }, 1200);
        }, 500);
        setIsProcessing(false);
        return;

      case 'run ai_agent':
        setConnectionStatus('connecting');
        await typeOutLines([
          { text: '' },
          { text: '[ai note]: establishing uplink...', type: 'system' },
          { text: '[system remark]: initializing neural interface.', type: 'remark' },
        ], 120);
        
        await new Promise((resolve) => setTimeout(resolve, CONFIG.TIMING.CONNECTION_TEST));
        
        try {
          const testResponse = await fetch(CONFIG.BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'ping' }),
          });
          
          if (testResponse.ok) {
            setConnectionStatus('online');
            await typeOutLines([
              { text: '[system]: uplink established.', type: 'success' },
              { text: '[ai note]: multi-agent system online.', type: 'remark' },
              { text: '' },
              { text: 'AI Agent Mode: ACTIVE', type: 'success' },
              { text: 'Backend: Google Gemini via Flask', type: 'system' },
              { text: 'Capabilities: Q&A, Web Search, Wikipedia, Summarization', type: 'system' },
              { text: '' },
              { text: "You can now ask me anything. Type 'exit_ai' to return to normal mode.", type: 'output' },
              { text: '' },
              { text: '[system remark]: cognitive load stable.', type: 'remark' },
              { text: '' },
            ], 100);
            setAiMode(true);
          } else {
            throw new Error('Connection failed');
          }
        } catch (error) {
          setConnectionStatus('offline');
          await typeOutLines([
            { text: '[error]: connection unstable. reinitializing link...', type: 'error' },
            { text: '[system]: operating in offline simulation mode.', type: 'system' },
            { text: '' },
            { text: 'AI Mode: SIMULATED (backend unavailable)', type: 'remark' },
            { text: "You can still interact, but responses will be simulated.", type: 'system' },
            { text: '' },
          ], 120);
          setAiMode(true);
        }
        break;

      case 'exit_ai':
        if (!aiMode) {
          await typeOutLines([
            { text: '' },
            { text: 'AI mode is not active.', type: 'system' },
            { text: '' },
          ], 100);
          break;
        }
        
        setAiMode(false);
        setConnectionStatus('offline');
        await typeOutLines([
          { text: '' },
          { text: '[ai note]: terminating uplink...', type: 'system' },
          { text: '[system]: neural interface closed.', type: 'success' },
          { text: '' },
          { text: 'AI Agent Mode: DEACTIVATED', type: 'system' },
          { text: '' },
        ], 120);
        break;

      case 'sudo elevate':
        await typeOutLines([
          { text: 'permission granted. welcome, root.', type: 'success' },
          { text: '' },
          { text: '[system]: all modules unlocked.', type: 'remark' },
          { text: '[system]: multi-agent architecture diagnostics: stable.', type: 'remark' },
          { text: '' },
          { text: '> initializing root protocol...', type: 'system' },
        ], 120);
        await new Promise((resolve) => setTimeout(resolve, 800));
        await typeOutLines([
          { text: '> argus.online', type: 'success' },
          { text: '> critic.standing_by', type: 'success' },
          { text: '> research.agent.active', type: 'success' },
          { text: '' },
          { text: '[shell message]: enjoy your stay, Karunya.', type: 'remark' },
          { text: '' },
        ], 180);
        setIsRoot(true);
        break;

      case 'karunya --version':
      case '--version':
        await typeOutLines([
          { text: '' },
          { text: `${CONFIG.SYSTEM.NAME} v${CONFIG.SYSTEM.VERSION}` },
          { text: `Build date: ${CONFIG.SYSTEM.BUILD_DATE}` },
          { text: 'Powered by Python, Gemini AI, and caffeine.' },
          { text: '' },
        ], 130);
        break;

      default:
        if (aiMode) {
          await handleAIQuery(trimmedCmd);
          break;
        }
        
        await typeOutLines([
          { text: '' },
          { text: `bash: ${trimmedCmd}: command not found`, type: 'error' },
          { text: "Type 'help' for available commands." },
          { text: `[tip]: maybe you meant 'about' or 'projects'?`, type: 'remark' },
          { text: '' },
        ], 120);
        break;
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim() || isProcessing || !asciiComplete) return;
    
    executeCommand(currentCommand);
    setCurrentCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1 >= commandHistory.length ? commandHistory.length - 1 : historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const handleCommandClick = (command: string) => {
    if (isProcessing || !asciiComplete) return;
    setCurrentCommand(command);
    setTimeout(() => {
      executeCommand(command);
      setCurrentCommand('');
    }, 100);
  };

  const handleCopyText = async (text: string) => {
    const content = text.includes(':') ? text.split(':')[1].trim() : text;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedText(content);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedText(content);
        setTimeout(() => setCopiedText(''), 2000);
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white font-mono relative overflow-hidden">
      <MatrixBackground />

      {aiMode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-6 right-6 z-[70] flex items-center gap-2 bg-[#1B1B1B]/90 backdrop-blur-sm border border-[#F8B400]/20 rounded px-3 py-2"
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 
                connectionStatus === 'online' ? '#00FF88' :
                connectionStatus === 'connecting' ? '#F8B400' :
                '#E63946',
              boxShadow: 
                connectionStatus === 'online' ? '0 0 8px #00FF88' :
                connectionStatus === 'connecting' ? '0 0 8px #F8B400' :
                '0 0 8px #E63946',
            }}
            animate={{
              opacity: connectionStatus === 'connecting' ? [1, 0.4, 1] : 1,
              scale: connectionStatus === 'connecting' ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: connectionStatus === 'connecting' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
          <span className="text-xs text-white/70">
            {connectionStatus === 'online' ? 'ONLINE' :
             connectionStatus === 'connecting' ? 'CONNECTING...' :
             'OFFLINE'}
          </span>
        </motion.div>
      )}

      <motion.div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: isAiThinking
            ? 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(248, 180, 0, 0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(248, 180, 0, 0.03) 0%, transparent 60%)',
        }}
        animate={{
          opacity: isAiThinking ? [1, 0.8, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isAiThinking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      <div 
        className="fixed inset-0 pointer-events-none z-35 mix-blend-soft-light opacity-10"
        style={{
          background: 'linear-gradient(180deg, rgba(248, 180, 0, 0.15) 0%, transparent 20%, transparent 80%, rgba(248, 180, 0, 0.15) 100%)',
        }}
      />

      <div 
        className="fixed inset-0 pointer-events-none z-55"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
        }}
      />

      <div 
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-25"
        style={{
          background: 'linear-gradient(0deg, rgba(27, 27, 27, 0.95) 0%, transparent 100%)',
        }}
      />

      <motion.div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.08]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          height: '120px',
        }}
        animate={{
          y: ['-120px', 'calc(100vh + 120px)'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 2px)',
        }}
      />

      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-45"
        animate={{
          opacity: screenDim ? 0.05 : 0,
        }}
        transition={{
          duration: 0.15,
        }}
      />

      {isAiThinking && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-48 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full border-2 border-[#F8B400]"
              style={{
                boxShadow: '0 0 20px rgba(248, 180, 0, 0.3)',
              }}
              animate={{
                scale: [1, 2.5, 3],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
          
          <motion.div
            className="w-16 h-16 rounded-full bg-[#F8B400]"
            style={{
              boxShadow: '0 0 40px rgba(248, 180, 0, 0.6), 0 0 80px rgba(248, 180, 0, 0.4)',
              filter: 'blur(8px)',
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}

      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto p-4 md:p-8 pb-32 relative z-50"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {outputLines.map((line, index) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 4, filter: 'brightness(1.3)' }}
                animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
                exit={{ opacity: 0, transition: { duration: 1.2 } }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`
                  ${line.type === 'system' ? 'text-white/60' : ''}
                  ${line.type === 'success' ? 'text-[#00FF88]' : ''}
                  ${line.type === 'prompt' ? 'text-[#F8B400]' : ''}
                  ${line.type === 'command' ? 'text-white/90' : ''}
                  ${line.type === 'output' ? 'text-[#CCCCCC]' : ''}
                  ${line.type === 'error' ? 'text-[#E63946]' : ''}
                  ${line.type === 'remark' ? 'text-[#00FFFF]/50 italic text-xs pl-8' : ''}
                  ${line.type === 'ascii' ? 'text-white/70 text-xs md:text-sm' : ''}
                  ${line.hoverable ? 'hover:text-[#F8B400]/90 transition-all duration-500 cursor-pointer' : ''}
                  ${line.copyable ? 'hover:text-[#F8B400]/90 transition-all duration-500 cursor-pointer' : ''}
                  text-sm md:text-base leading-relaxed whitespace-pre-wrap relative
                `}
                style={{
                  textShadow: line.type === 'ascii' 
                    ? '0 0 6px rgba(255, 255, 255, 0.25), 0 0 3px rgba(248, 180, 0, 0.15)'
                    : line.type === 'success' || line.type === 'error'
                    ? `0 0 4px currentColor`
                    : 'none',
                }}
                onClick={() => line.copyable && handleCopyText(line.text)}
              >
                {line.text}
                {index === outputLines.length - 1 && line.text && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 pointer-events-none"
                    initial={{ opacity: 0.08 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#F8B400]/80 text-sm md:text-base mt-2 relative"
            >
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                processing...
              </motion.span>
              <motion.div
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-40 h-12 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(248, 180, 0, 0.25) 0%, transparent 70%)',
                  filter: 'blur(16px)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}

          {asciiComplete && !isProcessing && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="flex items-center gap-2 mt-2 relative"
            >
              {aiMode && (
                <motion.div
                  className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-8"
                  style={{
                    background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.6) 0%, transparent 100%)',
                    boxShadow: '0 0 12px rgba(0, 255, 136, 0.4)',
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
              
              <span 
                className="text-[#F8B400] text-sm md:text-base shrink-0"
                style={{
                  textShadow: aiMode 
                    ? '0 0 4px rgba(248, 180, 0, 0.3), 0 0 8px rgba(0, 255, 136, 0.2)'
                    : '0 0 4px rgba(248, 180, 0, 0.3)',
                }}
              >
                {aiMode 
                  ? 'Karunya@ai_agent:~$' 
                  : isRoot 
                    ? 'Karunya@root:/$' 
                    : 'Karunya@terminal:~$'}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white/90 text-sm md:text-base caret-[#F8B400]"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <motion.span
                animate={{ 
                  opacity: showCursor ? [1, 0.2, 1] : [0.2, 0, 0.2],
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="text-[#F8B400] text-sm md:text-base"
                style={{
                  filter: showCursor ? 'drop-shadow(0 0 6px rgba(248, 180, 0, 0.6))' : 'drop-shadow(0 0 2px rgba(248, 180, 0, 0.2))',
                }}
              >
                █
              </motion.span>
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-12 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(248, 180, 0, 0.3) 0%, rgba(248, 180, 0, 0.1) 50%, transparent 70%)',
                  filter: 'blur(14px)',
                }}
                animate={{
                  opacity: showCursor ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />
            </motion.form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'brightness(1.4)' }}
            animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#F8B400] text-black px-4 py-2 rounded text-sm z-[70]"
            style={{
              boxShadow: '0 0 20px rgba(248, 180, 0, 0.5), 0 0 40px rgba(248, 180, 0, 0.3)',
            }}
          >
            Copied: {copiedText.substring(0, 30)}{copiedText.length > 30 ? '...' : ''}
          </motion.div>
        )}
      </AnimatePresence>

      {asciiComplete && !isProcessing && aiMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="hidden md:block fixed bottom-8 left-1/2 -translate-x-1/2 z-[65]"
        >
          <div 
            className="bg-[#1B1B1B]/95 border border-[#00FF88]/30 rounded px-4 py-2 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.15)',
            }}
          >
            <p className="text-xs text-[#00FF88]/70 text-center">
              AI Mode Active — Ask me anything about AI, research, or web queries
            </p>
          </div>
        </motion.div>
      )}

      {asciiComplete && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1B1B1B]/98 border-t border-[#F8B400]/20 p-4 backdrop-blur-sm z-[65]"
          style={{
            boxShadow: '0 -2px 20px rgba(248, 180, 0, 0.08)',
          }}
        >
          {aiMode && (
            <p className="text-xs text-[#00FF88]/70 text-center mb-3">
              AI Mode Active — Ask anything or use shortcuts below
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto">
            {(aiMode 
              ? ['exit_ai', 'help', 'clear'] 
              : ['about', 'projects', 'skills', 'contact', 'run ai_agent', 'help']
            ).map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommandClick(cmd)}
                className="px-3 py-2 bg-white/5 hover:bg-[#F8B400]/10 border border-[#F8B400]/25 hover:border-[#F8B400]/60 rounded text-[#F8B400] text-xs transition-all duration-300 active:scale-95"
                style={{
                  boxShadow: '0 0 8px rgba(248, 180, 0, 0.1)',
                }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
