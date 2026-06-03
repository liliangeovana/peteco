from flask import Flask, jsonify
from flask_cors import CORS
from clustering import executar_dbscan
from estatisticas import gerar_estatisticas
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY'),
)

@app.get('/clusters')
def clusters():
    try:
        return jsonify(executar_dbscan(supabase_client))
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.get('/estatisticas')
def estatisticas():
    try:
        return jsonify(gerar_estatisticas(supabase_client))
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.get('/health')
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
