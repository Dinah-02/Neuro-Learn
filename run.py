#!/usr/bin/env python3
"""
NeuroLearn AI Assistant - Startup Script
Run with: python run.py
"""
import uvicorn
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    """Start the NeuroLearn AI Assistant server"""
    from app.config import config
    
    print("🚀 Starting NeuroLearn AI Assistant...")
    print(f"📡 Server: http://{config.HOST}:{config.PORT}")
    print(f"🔍 Docs: http://{config.HOST}:{config.PORT}/docs")
    print(f"📊 Health: http://{config.HOST}:{config.PORT}/health")
    print("\n✨ Available Agents:")
    for agent, agent_config in config.AGENTS.items():
        if agent_config['enabled']:
            print(f"  • {agent.replace('_', ' ').title()}")
    
    print("\n📚 Knowledge Base:")
    print(f"  • DevNews: {config.KNOWLEDGE_BASE['max_results']} items")
    print(f"  • GitHub: {config.KNOWLEDGE_BASE['max_results']} projects")
    print(f"  • Tech Trends: {config.KNOWLEDGE_BASE['max_results']} trends")
    print("\n✅ Ready to process requests...\n")
    
    uvicorn.run(
        "app.main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info" if config.DEBUG else "warning",
        access_log=True
    )

if __name__ == "__main__":
    main()