# Karunya CLI OS — AI-Powered Portfolio

A cinema-grade interactive terminal portfolio powered by Google Gemini AI.

## 🎬 Features

### **Cinematic Terminal Interface**
- Atmospheric CRT effects with phosphor glow
- Two-layer Matrix parallax background
- Volumetric lighting and vignette effects
- Character-by-character typing animations (50-60ms per character)
- Voltage dip effects and signal wave animations

### **Live AI Integration**
- Connected to Flask backend at `https://flask-1yw5.onrender.com/chat`
- Powered by Google Gemini via google-genai SDK
- Real-time question answering
- Web search through Google Custom Search API
- Wikipedia lookups
- Text summarization
- Contextual responses

### **Connection Status**
- 🟢 **ONLINE**: Backend connected and responsive
- 🟡 **CONNECTING...**: Establishing connection or processing query
- 🔴 **OFFLINE**: Backend unavailable, simulated mode active

## 🖥️ Available Commands

### **Standard Mode**
- `about` - Display developer profile
- `projects` - List AI/ML projects
- `skills` - Show technical stack
- `contact` - Get contact information
- `run ai_agent` - Activate AI multi-agent system
- `help` - Show all commands
- `clear` - Clear terminal screen
- `exit` - Close session

### **AI Agent Mode**
Once activated with `run ai_agent`, you can:
- Ask questions about AI research
- Request web searches
- Query Wikipedia
- Get text summaries
- Have contextual conversations

To exit AI mode, type: `exit_ai`

## 🧠 AI System Behavior

### **Cinematic Delays**
- **2.5-3.5 seconds** thinking delay before API calls
- Simulates neural processing time
- Screen dims by 5% during processing
- Signal wave animation appears during thinking

### **Connection Flow**
1. User types `run ai_agent`
2. Terminal shows: `[ai note]: establishing uplink...`
3. System tests backend connection (1.5s)
4. If successful: `[system]: uplink established.`
5. AI mode activates with green status indicator
6. User can now interact with AI

### **Query Processing**
1. User types a question
2. Screen shows: `[ai note]: processing query...`
3. System pauses for 2.5-3.5 seconds (simulated thinking)
4. Status changes to 🟡 CONNECTING...
5. Sends POST request to backend
6. Response types character-by-character
7. System remark appears: `[system remark]: cognitive load stable.`

## 🎨 Visual Effects

### **AI Thinking State**
- Pulsing gold signal waves (3 concentric circles)
- Central glow with 40-80px shadow
- Screen brightness breathing effect
- Volumetric lighting intensity increase

### **AI Mode Indicators**
- Green vertical bar next to prompt
- Prompt changes to `Karunya@ai_agent:~$`
- Gold glow with green accent on prompt text
- Connection status badge in top-right corner

## 🔧 Backend API

### **Endpoint**
```
POST https://flask-1yw5.onrender.com/chat
```

### **Request Format**
```json
{
  "message": "Your question here"
}
```

### **Response Format**
```json
{
  "response": "AI-generated answer here"
}
```

## 🚀 Easter Eggs

- `sudo elevate` - Activate root mode
- `karunya --version` - Show version info
- Try asking the AI about Karunya's work!

## 📱 Mobile Support

- Responsive command shortcuts at bottom
- Touch-optimized interactions
- Device tilt parallax support
- Swipe-friendly scrolling

## 🎯 Technical Stack

**Frontend:**
- React with TypeScript
- Motion (Framer Motion) for animations
- Tailwind CSS v4.0
- Custom CRT/phosphor effects

**Backend:**
- Flask server on Render
- Google Gemini AI
- Google Custom Search API
- Wikipedia API integration

**Design Philosophy:**
- 60fps smooth animations
- Cinematic timing (no rushed interactions)
- Atmospheric over flashy
- Precision and mystery
- Authentic terminal feel

## 💡 Development Notes

### **Timing Guidelines**
- Boot sequence: 7 seconds total
- ASCII art: 220ms per line
- Character typing: 50-60ms with randomization
- Line spacing: 200ms between lines
- AI thinking: 2500-3500ms random
- Cursor pulse: 1.2s cycle

### **Performance**
- All effects optimized for 60fps
- Minimal blur filters (3-4px only)
- Hardware-accelerated transforms
- Efficient canvas rendering for Matrix effect

### **Accessibility**
- High contrast text (90% white on #1B1B1B)
- Readable font sizes (14-16px base)
- Smooth scrolling
- Click anywhere to focus input

## 🌐 Export Ready

This portfolio can be exported as a single HTML page:
- Inline CSS and JavaScript
- No external dependencies except JetBrains Mono font
- Works offline (AI features disabled)
- Static deployment compatible

## 📝 Version

**v2.0.0** - AI Integration Update
- Build date: November 7, 2025
- Powered by Python, Gemini AI, and caffeine

---

**Created by Karunya Muddana**
Backend & AI Developer | Hyderabad, India
