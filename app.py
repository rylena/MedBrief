import os
import uuid
import json
from flask import Flask, render_template, request, jsonify, send_from_directory
import google.generativeai as genai
from gtts import gTTS
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(BASE_DIR, 'templates')
static_dir = os.path.join(BASE_DIR, 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir)

from supabase import create_client, Client

_genai_initialized = False
_supabase_client = None
_model = None

def get_genai_model():
    global _genai_initialized, _model
    if not _genai_initialized:
        GENAI_API_KEY = os.getenv("GENAI_API_KEY")
        if GENAI_API_KEY:
            genai.configure(api_key=GENAI_API_KEY)
            _model = genai.GenerativeModel('gemini-flash-latest')
            _genai_initialized = True
    return _model

def get_supabase():
    global _supabase_client
    if _supabase_client is None:
        SUPABASE_URL = os.getenv("SUPABASE_URL")
        SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        if SUPABASE_URL and SUPABASE_KEY:
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client

if os.environ.get('VERCEL'):
    AUDIO_DIR = '/tmp/audio'
else:
    AUDIO_DIR = os.path.join(app.root_path, 'static', 'audio')

try:
    os.makedirs(AUDIO_DIR, exist_ok=True)
except Exception:
    pass



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/assistant')
def assistant():
    return render_template('chat.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/history')
def history():
    return render_template('history.html')

import re

import PIL.Image

@app.route('/summarize', methods=['POST'])
def summarize():
    text = ""
    image_part = None
    
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            try:
                if file.mimetype.startswith('image/'):
                    image = PIL.Image.open(file)
                    image_part = image
                    print("Image loaded successfully.")
                elif file.filename.endswith('.pdf'):
                    reader = PdfReader(file)
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                    print(f"Extracted {len(text)} characters from PDF.")
            except Exception as e:
                print(f"File processing error: {e}")
                return jsonify({'error': f"Error processing file: {str(e)}"}), 400
    
    if not image_part and not text.strip():
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '')
        else:
            text = request.form.get('text', '')
        
        if not text.strip():
            print("No text found in request.")
            return jsonify({'error': 'Please provide text, a PDF, or an image.'}), 400

    privacy_mode = request.form.get('privacy_mode') == 'true' or (request.is_json and request.get_json().get('privacy_mode') == True)
    if privacy_mode and text:
        text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED_SSN]', text)
        text = re.sub(r'\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+', '[REDACTED_NAME]', text)
        text = re.sub(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', '[REDACTED_DATE]', text)

    target_language = request.form.get('language', 'en')
    
    language_names = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'ur': 'Urdu',
        'vi': 'Vietnamese',
        'th': 'Thai',
        'tr': 'Turkish',
        'pl': 'Polish',
        'nl': 'Dutch',
        'sv': 'Swedish'
    }
    
    language_instruction = ""
    if target_language != 'en':
        language_instruction = f"\nIMPORTANT: Provide the entire response in {language_names.get(target_language, 'the selected language')}. Both the summary and key terms must be in {language_names.get(target_language, 'the selected language')}."

    try:
        prompt_instruction = f"""
        Analyze the following medical input (text or image). 
        1. Provide a 3-5 sentence summary at a Grade 8 reading level for a patient. Explain what the medical content means in simple terms.
        2. Extract 3-5 key medical terms from the content that a patient might not understand.
        {language_instruction}
        
        Format your response exactly as this JSON:
        {{
            "summary": "The summary text here...",
            "key_terms": ["term1", "term2", "term3"]
        }}
        """
        
        content_parts = [prompt_instruction]
        if image_part:
            content_parts.append(image_part)
            content_parts.append("Explain this medical image.")
        if text:
            content_parts.append(text)

        model = get_genai_model()
        response = model.generate_content(content_parts)
        
        response_text = response.text.replace('```json', '').replace('```', '').strip()
        
        try:
            result = json.loads(response_text)
            summary = result.get('summary', 'Summary not available.')
            key_terms = result.get('key_terms', [])
        except json.JSONDecodeError:
            summary = response.text
            key_terms = []

        tts = gTTS(text=summary, lang='en')
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        tts.save(filepath)
        audio_url = f"/static/audio/{filename}"

        return jsonify({
            'summary': summary,
            'key_terms': key_terms,
            'audio_url': audio_url
        })

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    context = data.get('context')

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        prompt = f"""
        Context (Medical Note):
        {context}

        User Question: {message}

        IMPORTANT: Answer in Hindi (हिन्दी). Provide your entire response in Hindi language.
        
        Answer the user's question based on the medical note provided. Keep the answer simple (Grade 8 level) and helpful. If the answer is not in the note, say so in Hindi.
        """
        model = get_genai_model()
        response = model.generate_content(prompt)
        return jsonify({'answer': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_DIR, filename)

if __name__ == '__main__':
    app.run(debug=False)
