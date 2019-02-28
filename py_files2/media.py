import speech_recognition as sr
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
r = sr.Recognizer()


def speechToText(AUDIO_FILE):
    with sr.AudioFile(AUDIO_FILE) as source:
         audio = r.record(source)
    try:
        txt = r.recognize_sphinx(audio)
        data={'Text':txt}
    except Exception as e:
        data={'Text':e}
    return data

def imgToText(path):
    text = pytesseract.image_to_string(Image.open(path))
    data={'Text':text}
    return data