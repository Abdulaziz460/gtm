from flask import Flask, render_template
from endpoints import api_bp


app = Flask(__name__)

app.register_blueprint(api_bp)


@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=63072000"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.get("/")
def read_root():
    return render_template("index.html")
