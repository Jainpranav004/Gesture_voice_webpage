import tensorflow as tf
import cv2
import numpy as np
import mediapipe as mp
from fastapi import FastAPI, File, UploadFile
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import time
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import InternalServerError, ResourceExhausted

# Paths to your saved model and labels file
model_path = 'converted/model.savedmodel/'
labels_path = 'converted/labels.txt'

# Load the model with error handling
try:
    model = tf.saved_model.load(model_path)
except Exception as e:
    print(f"Error loading the model: {e}")
    model = None

# Load labels
with open(labels_path, 'r') as f:
    labels = f.read().splitlines()

# Define confidence threshold
CONFIDENCE_THRESHOLD = 0.95

# Prepare a function to preprocess the hand region
def preprocess_frame(frame, hand_bbox):
    x_min, y_min, x_max, y_max = hand_bbox
    hand_region = frame[y_min:y_max, x_min:x_max]  # Crop to hand region
    hand_region = cv2.resize(hand_region, (224, 224))  # Resize to 224x224
    hand_region = hand_region / 255.0  # Normalize
    hand_region = np.expand_dims(hand_region, axis=0)  # Add batch dimension
    return hand_region

# Use the model's inference endpoint
infer = model.signatures['serving_default'] if model else None

# MediaPipe Hands setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_drawing = mp.solutions.drawing_utils

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store the detected words/numbers and last recognized word/number
detected_sentence = []
last_word = ""
word_count = 0
last_recognition_time = time.time()

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    global detected_sentence, last_word, word_count, last_recognition_time

    try:
        # Read image file
        image_bytes = await file.read()
        np_array = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if frame is None:
            raise ValueError("Failed to decode the image.")

        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            x_min, y_min = frame.shape[1], frame.shape[0]
            x_max, y_max = 0, 0

            for hand_landmarks in results.multi_hand_landmarks:
                for landmark in hand_landmarks.landmark:
                    x = int(landmark.x * frame.shape[1])
                    y = int(landmark.y * frame.shape[0])
                    x_min = min(x_min, x)
                    y_min = min(y_min, y)
                    x_max = max(x_max, x)
                    y_max = max(y_max, y)

            # Add padding to hand bounding box
            padding = 20
            x_min = max(0, x_min - padding)
            y_min = max(0, y_min - padding)
            x_max = min(frame.shape[1], x_max + padding)
            y_max = min(frame.shape[0], y_max + padding)

            hand_region = preprocess_frame(frame, (x_min, y_min, x_max, y_max))

            # Make prediction using the model
            predictions = infer(tf.convert_to_tensor(hand_region, dtype=tf.float32))
            prediction_probs = predictions['sequential_7'].numpy()
            predicted_class = np.argmax(prediction_probs, axis=1)[0]
            predicted_label = labels[predicted_class]
            confidence = prediction_probs[0][predicted_class]

            current_time = time.time()

            if confidence >= CONFIDENCE_THRESHOLD:
                if predicted_label == last_word:
                    word_count += 1
                else:
                    word_count = 1  # Reset count for new word/number

                if word_count >= 2 and predicted_label == last_word:
                    detected_sentence.append(predicted_label)
                    last_word = predicted_label
                    word_count = 0
                    last_recognition_time = current_time
                    combined_sentence = " ".join(detected_sentence)
                    return JSONResponse(content={"word": predicted_label, "sentence": await generate_meaningful_sentence(combined_sentence)})
                elif current_time - last_recognition_time >= 1.5:
                    last_word = predicted_label

            return JSONResponse(content={"word": "Uncertain", "sentence": " ".join(detected_sentence)})

        else:
            return JSONResponse(content={"word": "No Hand Detected", "sentence": " ".join(detected_sentence)})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Function to generate a meaningful sentence using the Gemini API
async def generate_meaningful_sentence(detected_sentence):
    load_dotenv()

    api_key ="AIzaSyD_p3zjAlKFdxjJB_9h-tgiIS5knsZA1Xw"
    if not api_key:
        raise ValueError("API key not found in environment variables.")

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name='gemini-1.5-pro',
        tools='code_execution'
    )

    prompt = f"Form a grammatically correct sentence using these words: {detected_sentence}."

    try:
        response = model.generate_content(prompt)
        sentence = response.text.split("")[-2]
    except IndexError:
        sentence = response.text.split('\n')[-2]
    except InternalServerError:
        print('Waiting for response...')
        time.sleep(60)
        return await generate_meaningful_sentence(detected_sentence)
    except ResourceExhausted:
        print("API QUOTA EXHAUSTED")
        return detected_sentence  # Return original sentence if quota is exhausted

    return sentence

# Optional: Endpoint to clear the detected sentence
@app.post("/clear/")
async def clear_sentence():
    global detected_sentence
    detected_sentence = []
    return JSONResponse(content={"message": "Detected sentence cleared."})
