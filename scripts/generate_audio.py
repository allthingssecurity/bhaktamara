#!/usr/bin/env python3
"""Generate TTS audio for Bhaktamar Stotra using NVIDIA Riva"""

import os
import wave
import struct

import riva.client

API_KEY = "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"
SERVER = "grpc.nvcf.nvidia.com:443"
FUNCTION_ID = "877104f7-e885-42b9-8de8-f6e4c6303969"
VOICE = "Magpie-Multilingual.EN-US.Aria"
SAMPLE_RATE = 22050

def synthesize_speech(text: str, output_file: str, language_code: str = "en-US"):
    """Generate speech from text using NVIDIA Riva TTS"""

    metadata = [
        ["function-id", FUNCTION_ID],
        ["authorization", f"Bearer {API_KEY}"],
    ]

    auth = riva.client.Auth(None, True, SERVER, metadata)
    service = riva.client.SpeechSynthesisService(auth)

    print(f"Generating audio for: {text[:60]}...")

    # Collect all audio chunks
    audio_data = b""
    responses = service.synthesize_online(
        text,
        VOICE,
        language_code,
        sample_rate_hz=SAMPLE_RATE,
        zero_shot_audio_prompt_file=None,
        zero_shot_quality=20,
        custom_dictionary={},
    )

    for resp in responses:
        audio_data += resp.audio

    # Save as WAV file
    with wave.open(output_file, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        wav_file.writeframes(audio_data)

    print(f"Saved: {output_file} ({len(audio_data)} bytes)")
    return True

if __name__ == "__main__":
    # Test with a simple phrase
    os.makedirs("../public/audio", exist_ok=True)

    test_text = "Namaste! Welcome to Bhaktamar Stotra. This sacred hymn has 48 verses praising Lord Adinath."
    synthesize_speech(test_text, "../public/audio/test.wav")

    print("\nTest complete!")
