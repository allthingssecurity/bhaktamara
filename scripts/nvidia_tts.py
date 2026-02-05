#!/usr/bin/env python3
"""NVIDIA TTS Script for Bhaktamar Stotra"""

import requests
import base64
import sys
import os

# NVIDIA API endpoint for TTS
NVIDIA_TTS_URL = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/877104f7-e885-42b9-8de8-f6e4c6303969"

def synthesize_speech(text, api_key, output_file="output.wav", voice="Magpie-Multilingual.EN-US.Aria"):
    """Generate speech from text using NVIDIA TTS API"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "input": text,
        "voice": voice,
        "language_code": "en-US",
        "sample_rate": 22050
    }

    print(f"Generating audio for: {text[:50]}...")

    try:
        response = requests.post(NVIDIA_TTS_URL, headers=headers, json=payload, timeout=30)

        if response.status_code == 200:
            result = response.json()
            if "audio" in result:
                audio_data = base64.b64decode(result["audio"])
                with open(output_file, "wb") as f:
                    f.write(audio_data)
                print(f"Audio saved to: {output_file}")
                return True
            else:
                print(f"Unexpected response: {result}")
        else:
            print(f"Error {response.status_code}: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

    return False

def test_nvidia_api_key(api_key):
    """Test if the API key works"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Simple test request
    try:
        response = requests.get(
            "https://api.nvcf.nvidia.com/v2/nvcf/functions",
            headers=headers,
            timeout=10
        )
        return response.status_code == 200
    except:
        return False

if __name__ == "__main__":
    # API keys to test
    keys = [
        "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",
    ]

    test_text = "Namaste! Welcome to Bhaktamar Stotra learning."

    for i, key in enumerate(keys):
        print(f"\n--- Testing API Key {i+1} ---")
        print(f"Key: {key[:20]}...")

        # Test the key
        if synthesize_speech(test_text, key, f"test_audio_{i+1}.wav"):
            print(f"SUCCESS! Key {i+1} works!")
            break
        else:
            print(f"Key {i+1} did not work")
