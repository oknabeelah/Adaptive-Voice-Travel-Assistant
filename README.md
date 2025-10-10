# Adaptive-Voice-Travel-Assistant
Adaptive Voice Travel Assistant - solution for 'HackHer' Women in AI hackathon (Oct 10th 2025)

### ❓Why:

- Combines the most companies (ElevenLabs + Incident.io + Granola)
    
- Clear _AI + real-world value_ story
- Add more...
    
### 🧩 MVP Breakdown (Minimum viable product)

|Component|Tool|Description|
|---|---|---|
|Voice Output|ElevenLabs|Convert AI text → natural voice|
|Reasoning|GPT / local model|Build itinerary, adapt plans|
|Context Memory|Simple JSON or Granola|Store user prefs (“likes early flights”)|
|Adaptation|Simulated events|e.g. “flight delayed” trigger updates|
|UI (optional)|React / CLI|Show updated schedule|

---
## ⏱️ 4-Hour Build Plan

**Hour 1:** Basic prompt chain – “input travel info → itinerary output”  
**Hour 2:** Add simulated “change event” and adaptive replan logic  
**Hour 3:** Integrate ElevenLabs TTS for speaking updates  
**Hour 4:** Create short live demo script (“User: ‘Plan my weekend in LA.’ → System: [plans + speaks] → Flight delay simulated → new plan + voice update”)

---
## 🔥 Pitch Line

> “We built **VoyceTrip** — a voice-driven travel assistant that plans your trips, remembers your preferences, and adapts as your plans change. Think Siri meets your travel agent — powered by ElevenLabs’ voice, Granola’s context memory, and Incident.io’s adaptability.”

---

