import os
import subprocess
import tempfile
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/status', methods=['GET'])
def home():
    return {"status": "running"}


@app.route('/format', methods=['POST'])
def format_code():
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({"error": "No code provided"}), 400

    c_code = data['code']
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=".c", mode='w', delete=False) as temp_file:
            temp_file.write(c_code)
            temp_file_path = temp_file.name

        fix_process = subprocess.run(
            ['bettyfixer', temp_file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        with open(temp_file_path, 'r') as f:
            formatted_code = f.read()

        return jsonify({
            "original_code": c_code,
            "formatted_code": formatted_code,
            "errors": fix_process.stderr
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

