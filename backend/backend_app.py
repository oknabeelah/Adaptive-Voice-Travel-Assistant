"""
VoyceTrip Backend - Automated Workflow API
Handles chat-based travel planning with voice/text input
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GRANOLA_API_KEY = os.getenv('GRANOLA_API_KEY')
CODEWORDS_API_KEY = os.getenv('CODEWORDS_API_KEY')
CODEWORDS_WORKFLOW_ID = os.getenv('CODEWORDS_WORKFLOW_ID')

# Simulated workflow states
class TravelWorkflow:
    def __init__(self):
        self.state = "greeting"
        self.user_data = {}
        self.conversation_history = []

    def process_message(self, user_input, input_type="text"):
        """Process user input and return appropriate response"""

        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": user_input,
            "type": input_type,
            "timestamp": datetime.now().isoformat()
        })

        # Determine response based on current state
        response = self._get_response(user_input)

        # Add assistant message to history
        self.conversation_history.append({
            "role": "assistant",
            "content": response["message"],
            "type": "text",
            "timestamp": datetime.now().isoformat(),
            "suggestions": response.get("suggestions", [])
        })

        return response

    def _get_response(self, user_input):
        """Generate contextual responses based on workflow state"""

        user_input_lower = user_input.lower()

        # Greeting state
        if self.state == "greeting":
            if any(word in user_input_lower for word in ["hello", "hi", "hey", "start"]):
                self.state = "ask_destination"
                return {
                    "message": "Hello! I'm your VoyceTrip assistant. I'm here to help plan your perfect trip. Where would you like to go?",
                    "suggestions": ["Los Angeles", "New York", "Paris", "Tokyo", "Surprise me!"],
                    "state": self.state
                }

        # Ask destination
        if self.state == "ask_destination":
            self.user_data["destination"] = user_input
            self.state = "ask_dates"
            return {
                "message": f"Great choice! {user_input} is amazing! When are you planning to visit?",
                "suggestions": ["This weekend", "Next month", "In 2 weeks", "I'm flexible"],
                "state": self.state
            }

        # Ask dates
        if self.state == "ask_dates":
            self.user_data["dates"] = user_input
            self.state = "ask_preferences"
            return {
                "message": "Perfect! Now, what kind of experience are you looking for?",
                "suggestions": ["Adventure", "Relaxation", "Culture", "Food & Dining", "Mix of everything"],
                "state": self.state
            }

        # Ask preferences
        if self.state == "ask_preferences":
            self.user_data["preferences"] = user_input
            self.state = "ask_budget"
            return {
                "message": "Excellent! What's your budget range for this trip?",
                "suggestions": ["Budget-friendly ($)", "Moderate ($$)", "Luxury ($$$)", "No budget limit"],
                "state": self.state
            }

        # Ask budget
        if self.state == "ask_budget":
            self.user_data["budget"] = user_input
            self.state = "generating_itinerary"
            return {
                "message": "Wonderful! Let me create a personalized itinerary for you...",
                "suggestions": [],
                "state": self.state,
                "show_loading": True
            }

        # Generating itinerary
        if self.state == "generating_itinerary":
            self.state = "show_itinerary"
            itinerary = self._generate_itinerary()
            return {
                "message": f"Here's your personalized itinerary for {self.user_data.get('destination', 'your destination')}!",
                "itinerary": itinerary,
                "suggestions": ["Book this trip", "Make changes", "Start over"],
                "state": self.state
            }

        # Default response
        return {
            "message": "I'm here to help plan your trip! Just tell me where you'd like to go.",
            "suggestions": ["Plan a trip", "Show my past trips", "Help"],
            "state": "greeting"
        }

    def _generate_itinerary(self):
        """Generate a sample itinerary based on user data"""
        destination = self.user_data.get("destination", "your destination")

        return {
            "destination": destination,
            "duration": "3 days",
            "days": [
                {
                    "day": 1,
                    "title": "Arrival & Exploration",
                    "activities": [
                        {"time": "10:00 AM", "activity": "Arrive and check into hotel"},
                        {"time": "12:00 PM", "activity": "Lunch at local favorite restaurant"},
                        {"time": "2:00 PM", "activity": "Walking tour of main attractions"},
                        {"time": "7:00 PM", "activity": "Dinner with city views"}
                    ]
                },
                {
                    "day": 2,
                    "title": "Adventure Day",
                    "activities": [
                        {"time": "9:00 AM", "activity": "Breakfast at hotel"},
                        {"time": "10:00 AM", "activity": "Visit popular landmark"},
                        {"time": "1:00 PM", "activity": "Lunch in historic district"},
                        {"time": "3:00 PM", "activity": "Museum or cultural site"},
                        {"time": "8:00 PM", "activity": "Evening entertainment"}
                    ]
                },
                {
                    "day": 3,
                    "title": "Relaxation & Departure",
                    "activities": [
                        {"time": "9:00 AM", "activity": "Leisurely breakfast"},
                        {"time": "11:00 AM", "activity": "Last-minute shopping"},
                        {"time": "1:00 PM", "activity": "Lunch before departure"},
                        {"time": "3:00 PM", "activity": "Check out and head to airport"}
                    ]
                }
            ],
            "estimated_cost": self.user_data.get("budget", "Moderate"),
            "preferences": self.user_data.get("preferences", "Mixed activities")
        }

# Global workflow instance (in production, use session management)
workflows = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from frontend"""
    data = request.json
    user_message = data.get('message', '')
    input_type = data.get('type', 'text')  # 'text' or 'voice'
    session_id = data.get('session_id', 'default')

    # Get or create workflow for this session
    if session_id not in workflows:
        workflows[session_id] = TravelWorkflow()

    workflow = workflows[session_id]

    # Process message
    response = workflow.process_message(user_message, input_type)

    return jsonify({
        'success': True,
        'response': response,
        'conversation_history': workflow.conversation_history[-10:]  # Last 10 messages
    })

@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset conversation"""
    data = request.json
    session_id = data.get('session_id', 'default')

    if session_id in workflows:
        workflows[session_id] = TravelWorkflow()

    return jsonify({
        'success': True,
        'message': 'Conversation reset'
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get conversation history"""
    session_id = request.args.get('session_id', 'default')

    if session_id in workflows:
        return jsonify({
            'success': True,
            'history': workflows[session_id].conversation_history
        })

    return jsonify({
        'success': True,
        'history': []
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 VoyceTrip Backend starting...")
    print("📍 API running on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
