#!/usr/bin/env python3
"""
Generate TTS audio for all 48 Bhaktamar Stotra verses using NVIDIA Riva.
Run this script from the pipecat venv that has nvidia-riva-client installed.

Usage:
    source /path/to/pipecat/.venv/bin/activate
    python generate_all_audio.py
"""

import os
import sys
import wave
import time

import riva.client

# NVIDIA API Configuration
API_KEY = "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"
SERVER = "grpc.nvcf.nvidia.com:443"
FUNCTION_ID = "877104f7-e885-42b9-8de8-f6e4c6303969"
VOICE = "Magpie-Multilingual.EN-US.Aria"
SAMPLE_RATE = 22050

# Kid-friendly explanations for each stotra
STOTRA_TEXTS = [
    "Imagine bright sparkling jewels on the crowns of angels who bow down with love! Their light chases away all darkness. Lord Adinath's feet are like a strong rope that saves people who are struggling in a big ocean.",
    "The smartest angels and gods in heaven praise Lord Adinath with beautiful songs! Their songs are so wonderful that everyone in all three worlds loves to hear them. Now I will also try to praise this great Lord!",
    "Even though I'm not very smart, when I try to praise Lord Adinath, beautiful words just start flowing like magic! It's like even small creatures living near powerful snakes become brave!",
    "Lord Adinath has SO many good qualities - like an endless ocean! Even the smartest teacher in heaven can't describe them all. It's like trying to swim across a giant ocean full of crocodiles using just your arms - impossible!",
    "Even though I'm not very good at this, my love for Lord Adinath makes me want to try! Just like a mother deer bravely faces a scary lion to protect her baby - love makes us do brave things!",
    "I don't know much and smart people might laugh at me. But my love for Lord Adinath makes me want to sing anyway! Just like a little cuckoo bird sings its sweet song when it sees pretty mango flowers in spring!",
    "When we praise Lord Adinath, all the bad things we've done disappear quickly - like magic! It's just like when the bright sun comes up in the morning and chases away all the darkness of the night!",
    "With Lord Adinath's help, even someone like me can write beautiful praises! It's like a tiny water drop on a lotus leaf - it becomes as shiny and pretty as a real pearl! Good people will love to hear these words!",
    "Praising Lord Adinath removes all our mistakes! But even just TALKING about him helps everyone! It's like how the sun, even from far away, makes beautiful lotus flowers open up and bloom!",
    "Here's something amazing - when we praise Lord Adinath with a true heart, we can become like him! A truly rich person should share and help others become rich too. Lord Adinath shares his goodness with us!",
    "Once you see Lord Adinath, you can't look away - he's SO beautiful! After seeing him, nothing else looks as nice. It's like after drinking delicious sweet milk, who would want to drink salty ocean water?",
    "Lord Adinath was made from special, peaceful, glowing atoms! These special atoms are so rare - they were all used to make just him! That's why there's no one else in the whole universe who looks as wonderful as him!",
    "Lord Adinath's face is SO beautiful that everyone - gods, people, even magical snakes - can't stop looking at it! Compared to his face, even the moon looks dirty and pale, like a dried-up leaf!",
    "Lord Adinath's good qualities shine brighter than a full moon! They spread across all three worlds! And whoever takes his protection can go anywhere they want - no one can stop them!",
    "Even the most beautiful angel ladies couldn't distract Lord Adinath! His mind stayed perfectly calm. It's like Mount Mandara - the biggest mountain - even the strongest winds at the end of the world can't shake it!",
    "A lamp flame might seem bright, but it's nothing compared to Lord Adinath's face! His face glows like the most beautiful moon - no lamp or even the real moon can compare to it!",
    "Some people have loved Lord Adinath for many, many lifetimes! They've been waiting SO long to see him! For them, hearing beautiful words about the Lord is the best gift ever!",
    "Lord Adinath's words are so powerful and beautiful that they don't need any decoration! They're already perfect! Like when pure water flows over sandalwood - the sweet smell stays and doesn't wash away!",
    "After seeing Lord Adinath, even the other great gods like Vishnu and Shiva seem less amazing! Once you've seen the best, nothing else can make your heart as happy - not even in your next life!",
    "Many mothers have many children because of their good deeds. But Lord Adinath is extra special - gods, humans, and perfected beings all worship him because he's the ONE who can help everyone become free and happy forever!",
    "Wise sages say Lord Adinath is like a bright sun - pure and beyond all darkness! When you truly understand him, you can even defeat death! He is the ONLY path to true happiness!",
    "Good people describe Lord Adinath in so many ways: He never changes, he's everywhere, he's impossible to fully understand, he's the first one, he's the Lord of everything, he controls all desires, and he IS pure knowledge!",
    "Lord Adinath is called Buddha because gods worship his wisdom! He's called Shankara because he helps all three worlds! He's the Creator of the path to freedom! He truly is the greatest person ever!",
    "I bow to Lord Adinath who takes away everyone's pain! I bow to him who is the most beautiful jewel on Earth! I bow to the greatest Lord of all worlds! I bow to him who can dry up the scary ocean of problems!",
    "Lord Adinath is SO full of good qualities that there's no room for anything bad! Not even in dreams have any faults or bad things ever come near him - they're too scared to even look at him!",
    "Lord Adinath sits under a beautiful Ashoka tree and glows with light! He shines so bright - like the sun peeking out from behind a cloud, chasing away all the darkness!",
    "Lord Adinath's body glows like pure gold! Beautiful white fans wave around him! He looks like the golden top of the magical Mount Meru with streams of moon-white water flowing down its sides!",
    "Three beautiful umbrellas float above Lord Adinath! They're as bright as the moon and keep away the hot sun! Strings of pearls hang from them, telling everyone that he is the King of all three worlds!",
    "Magical drums play in the sky for Lord Adinath! Their deep, booming sounds fill every direction! They tell everyone that the true King has won and invite people from all three worlds to come celebrate!",
    "In Lord Adinath's royal hall, magical flowers rain down from the sky! Beautiful heavenly flowers like Mandara and Parijata fall gently with sweet smells and cool breezes - like the most wonderful flower party ever!",
    "Even the king of gods, Indra, and all the other gods bow down to Lord Adinath! The sparkly jewels from their crowns make his lotus feet glow so beautifully, lighting up his whole face!",
    "Beautiful angel-ladies with lotus-flower eyes serve Lord Adinath, waving cool fans! Surrounded by divine helpers, his glory wins over all three worlds and destroys all dark, proud thoughts!",
    "Lord Adinath's arms are pure white like camphor and shine like the beautiful heads of royal elephants with flags! When I bow to him, all my bad habits and mistakes run away scared!",
    "Lord Adinath sits on a magnificent throne surrounded by beauty and glowing with light from waving fans! May he be like a beautiful jewel that helps me win everyone's hearts with goodness!",
    "May Lord Adinath's beautiful lotus face always shine in my heart and never go away - even in my dreams! He is my leader who will help me swim across the huge ocean of life's troubles!",
    "I'm not embarrassed to praise Lord Adinath even though I'm not very good at it! It's like a cute little baby who sees the moon reflected in a mirror and happily touches it, not knowing the real moon is far away in the sky!",
    "Some people might criticize my words because they look for mistakes. But my love for Lord Adinath makes me want to praise him anyway! Who will help me sing his praises even if my words are simple?",
    "Even a little bit of love for Lord Adinath counts as BIG love! Please accept my small offering! Just like even the most precious diamond becomes just a part of an earring - my small love is still special to him!",
    "I made a beautiful garland of praises for Lord Adinath, woven with his wonderful qualities! Just like sweet honey comes from flowers (not fruits), please accept my loving words and wear them on your head as a gift!",
    "I wrote these praises with all my heart to make Lord Adinath happy! My biggest wish is that these words bring me close to him - not just now, but in all my future lives too! Forever friends with the Lord!",
    "If you read these praises of Lord Adinath every day with love, amazing things happen! You'll get freedom from all troubles, lots of good things in life, and eventually reach the highest happiness - liberation!",
    "This special hymn has been blessed by magical beings from heaven! It helps sort out the good things from the bad things in our lives. Lord Adinath, please accept these praises that will help us become free!",
    "People who happily read these beautiful praises every day with a smile get amazing gifts! These gifts are like a magical boat that helps them sail across the big ocean of life's ups and downs!",
    "The sparkling jewels on the crowns of devoted angels light up everything and destroy all darkness of bad deeds! I bow to Lord Adinath's feet - they've been saving drowning people since the very beginning of time!",
    "People who worship Lord Adinath every evening by remembering his wonderful qualities will become completely FREE from all the scary things in life! No more fear - just freedom and happiness!",
    "If you want happiness that lasts forever, a great life, no pain, and a clean heart - then sing these praises to Lord Adinath! Quick pleasures don't last, but having a calm, strong mind is what really matters!",
    "We worship Lord Rishabha (Adinath) who glows like the sun! He was the first great teacher, son of King Nabhi, with endless good qualities! He is pure, free from all dirt, and gives wonderful blessings to everyone!",
    "This special Bhaktamara prayer was written long ago by the wise sage Manatunga! Anyone who reads it every day, or even just listens to it, will succeed in life! These magic words bring blessings to everyone!",
]

def create_riva_service():
    """Create and return the Riva TTS service."""
    metadata = [
        ["function-id", FUNCTION_ID],
        ["authorization", f"Bearer {API_KEY}"],
    ]
    auth = riva.client.Auth(None, True, SERVER, metadata)
    return riva.client.SpeechSynthesisService(auth)

def synthesize_speech(service, text: str, output_file: str):
    """Generate speech from text using NVIDIA Riva TTS."""
    print(f"  Generating: {text[:50]}...")

    try:
        # Collect all audio chunks
        audio_data = b""
        responses = service.synthesize_online(
            text,
            VOICE,
            "en-US",
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

        print(f"  Saved: {output_file} ({len(audio_data)} bytes)")
        return True

    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    """Generate audio for all 48 stotras."""
    output_dir = "../public/audio"
    os.makedirs(output_dir, exist_ok=True)

    print("=" * 60)
    print("Bhaktamar Stotra Audio Generator")
    print("Using NVIDIA Riva TTS (Magpie Multilingual)")
    print("=" * 60)
    print()

    # Create service once
    print("Connecting to NVIDIA Riva TTS service...")
    service = create_riva_service()
    print("Connected!")
    print()

    # Generate intro audio
    print("Generating introduction audio...")
    intro_text = "Welcome to Bhaktamar Stotra! This sacred hymn has 48 verses praising Lord Adinath, the first Tirthankara. Let's learn one verse each day with love and devotion."
    synthesize_speech(service, intro_text, f"{output_dir}/intro.wav")
    print()

    # Generate audio for each stotra
    success_count = 0
    for i, text in enumerate(STOTRA_TEXTS, 1):
        print(f"[{i}/48] Verse {i}")
        output_file = f"{output_dir}/stotra_{i}.wav"

        if synthesize_speech(service, text, output_file):
            success_count += 1

        # Small delay to avoid rate limiting
        time.sleep(0.5)
        print()

    print("=" * 60)
    print(f"Audio generation complete!")
    print(f"Successfully generated: {success_count}/48 audio files")
    print(f"Output directory: {output_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()
