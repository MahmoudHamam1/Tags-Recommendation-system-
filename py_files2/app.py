from flask import Flask
import pandas as pd
from flask import render_template
from flask import request
from typing import Optional, Dict, Any, Union
from flask import jsonify
import FB_Model as fm
import os , sys
import media as md



from ContentBased import ContentBased
app = Flask(__name__)
cb = ContentBased()


@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/api/tags", methods = ['post', 'get'])
def getTags():
    title = request.args.get("title")
    body = request.args.get("body")

    if body is None or title is None:
        req = {"title": None, "body": None}
        res = {
        'tags':[],
        'req': req
        }

        return jsonify(res)

    tags = cb.getTags(title, body)

    if len(tags) < 20:
        text = cb.clean("{} {}".format(title, body))
        tags =  list(fm.get_ferq_with_txt(text, list(tags)))


    req = {"title": title, "body": body}

    res = {
    'tags': tags,

    'req': req
    }

    return jsonify(res)

@app.route("/api/voice",methods=["POST"])
def speechToText():
    file=request.files['file']
    file.save(os.path.join("/tmp/voice", file.filename))
    AUDIO_FILE = os.path.join("/tmp/voice", file.filename)
    data= md.speechToText(AUDIO_FILE)
    #data={'Text':os.path.join("/tmp/", filename)}
    return jsonify(data)

@app.route("/api/img",methods=["POST"])
def imgToText():
    file=request.files['file']
    file.save(os.path.join("/tmp/img", file.filename))
    path = os.path.join("/tmp/img", file.filename)
    data=md.imgToText(path)
    return jsonify(data)



#################################### For solving cross ##########################
@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response

###################################  Runnting the server #################################################
if __name__ == '__main__':
    app.run(host="127.0.0.1",port=9090)
