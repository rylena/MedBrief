# MedBrief - Patient-Friendly Medical Translator

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python Version">
  <img src="https://img.shields.io/badge/Flask-2.0+-green.svg" alt="Flask">
  <img src="https://img.shields.io/badge/License-Patent%20Pending-red.svg" alt="Patent Pending">
</div>

## Live Demo

Visit the live application: [MedBrief](https://medbrief.vercel.app)

## Overview

MedBrief is an AI-powered medical translation platform designed to help patients understand complex medical documents, prescriptions, and clinical notes. The application uses advanced natural language processing to convert medical jargon into simple, grade 8 reading level explanations, making healthcare information accessible to everyone.

## Key Features

### 1. Medical Document Translation

Transform complex medical notes into patient-friendly summaries with the following capabilities:

- **Text Input**: Paste medical notes directly into the application
- **PDF Upload**: Upload medical documents in PDF format for automatic text extraction
- **Image Recognition**: Upload photos of prescriptions or medical documents for OCR processing
- **Multi-format Support**: Seamlessly handles text, PDF, and image inputs

### 2. AI-Powered Summarization

Leveraging Google's Gemini AI, MedBrief provides:

- **Simplified Summaries**: 3-5 sentence explanations at grade 8 reading level
- **Key Medical Terms**: Extraction and explanation of important medical terminology
- **Medication Information**: Detailed breakdown of prescribed medications including dosage, frequency, and purpose
- **Severity Assessment**: Automatic categorization of medical information as routine, monitor, or urgent

### 3. Voice Input Technology

Hands-free interaction through advanced speech recognition:

- **Medical Notes Entry**: Dictate medical information instead of typing
- **Chatbot Voice Queries**: Ask questions about your medical notes using voice commands
- **Multi-language Recognition**: Voice input supports all 21 available languages
- **Real-time Transcription**: Instant conversion of speech to text with visual feedback

### 4. Intelligent Medical Assistant

Interactive AI chatbot for medical note clarification:

- **Contextual Understanding**: Ask follow-up questions about your translated medical notes
- **Natural Conversation**: Engage in natural language dialogue about your health information
- **Persistent Context**: Maintains conversation history for coherent multi-turn interactions
- **Voice-Enabled**: Use voice input to ask questions hands-free

### 5. Multilingual Support

Comprehensive language support for global accessibility:

**Supported Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Bengali, Urdu, Vietnamese, Thai, Turkish, Polish, Dutch, Swedish, Malayalam

- **Full Translation**: Both summaries and medical terms translated to selected language
- **Audio Playback**: Text-to-speech in the selected language for accessibility
- **Voice Input Adaptation**: Speech recognition automatically adjusts to selected language

### 6. Privacy Protection

Built-in privacy features to protect sensitive information:

- **Automatic Redaction**: Optional privacy mode that redacts:
  - Social Security Numbers
  - Patient names with titles (Dr., Mr., Mrs., Ms.)
  - Date of birth and appointment dates
- **Secure Processing**: All data processing occurs server-side with encryption
- **No Data Retention**: Medical content is not stored without user consent

### 7. Medication Intelligence

Comprehensive medication information system:

- **Medication Extraction**: Automatically identifies prescribed medications from medical notes
- **Detailed Information**: Provides generic names, purposes, and usage instructions
- **Alternative Suggestions**: Lists generic equivalents and alternative medications
- **Pharmacy Integration**: Direct links to major online pharmacies (1mg, PharmEasy, Netmeds, Apollo Pharmacy)
- **Cost Comparison**: Easy access to price comparison across multiple pharmacy platforms

### 8. Audio Accessibility

Text-to-speech functionality for enhanced accessibility:

- **Summary Narration**: Listen to medical summaries instead of reading
- **Multi-language Audio**: Audio generation in all 21 supported languages
- **Downloadable Audio**: Save audio files for offline listening
- **Playback Controls**: Standard audio controls for pause, rewind, and volume adjustment

### 9. User Authentication

Secure account management powered by Supabase:

- **Email/Password Authentication**: Traditional signup and login
- **Google Sign-In**: Quick authentication via Google OAuth
- **Session Management**: Secure session handling with automatic timeout
- **Password Security**: Encrypted password storage and secure authentication flow

### 10. History Tracking

Personal medical note archive:

- **Automatic Saving**: All translated notes saved to user account
- **Chronological Organization**: Notes sorted by date and time
- **Quick Access**: Instant retrieval of past translations
- **Audio Preservation**: Saved audio files accessible from history
- **Search and Filter**: Easy navigation through historical records

### 11. Sharing Capabilities

Multiple sharing options for convenience:

- **WhatsApp Integration**: Share summaries directly via WhatsApp
- **SMS Messaging**: Send summaries through text messages
- **Email Sharing**: Forward medical summaries via email
- **Copy to Clipboard**: Quick copy for pasting into other applications
- **Print-Friendly Format**: Optimized layout for printing with large text

### 12. Severity Indicators

Visual urgency classification system:

- **Routine**: Green indicator for regular checkups and non-urgent matters
- **Monitor**: Yellow indicator for conditions requiring attention
- **Urgent**: Red indicator for situations requiring immediate medical attention
- **Clear Visual Cues**: Color-coded badges with descriptive text
- **Contextual Recommendations**: Guidance based on severity level

## Technical Architecture

### Backend

- **Framework**: Flask (Python)
- **AI Engine**: Google Gemini AI (gemini-flash-latest)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Text-to-Speech**: gTTS (Google Text-to-Speech)
- **PDF Processing**: pypdf
- **Image Processing**: PIL (Python Imaging Library)

### Frontend

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with custom properties and animations
- **Vanilla JavaScript**: No framework dependencies for optimal performance
- **Web Speech API**: Browser-native speech recognition
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

### Deployment

- **Platform**: Vercel
- **Environment**: Serverless functions
- **CDN**: Global content delivery for optimal performance
- **SSL**: Automatic HTTPS encryption

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Supabase account
- Google Gemini API key

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/rylena/MedBrief.git
cd MedBrief
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following variables:
```
GENAI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Run the application:
```bash
python app.py
```

5. Access the application at `http://localhost:5000`

## Database Schema

The application uses a single table for storing user summaries:

```sql
CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    summary TEXT NOT NULL,
    key_terms TEXT[],
    audio_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### `/summarize` (POST)
Processes medical notes and returns simplified summary
- **Input**: Text, PDF file, or image
- **Output**: Summary, key terms, medications, severity level, audio URL

### `/chat` (POST)
Handles chatbot interactions
- **Input**: User message and medical note context
- **Output**: AI-generated response

### `/medication_info` (POST)
Retrieves detailed medication information
- **Input**: Medication name
- **Output**: Generic name, purpose, alternatives, pharmacy links

## Security Features

- Environment variable configuration for sensitive data
- Server-side API key management
- Supabase Row Level Security (RLS) policies
- HTTPS encryption in production
- Input sanitization and validation
- No client-side storage of sensitive information

## Browser Compatibility

- Chrome/Edge: Full support including voice input
- Safari: Full support including voice input
- Firefox: Limited voice input support
- Mobile browsers: Responsive design with touch optimization

## Contributing

This project is currently patent pending. For collaboration inquiries, please contact the author.

## License

Copyright 2025 Rylen Anil. Patent Pending.

## Author

Made by Rylen Anil, 2025

## Acknowledgments

- Google Gemini AI for natural language processing
- Supabase for authentication and database services
- Vercel for hosting and deployment infrastructure
