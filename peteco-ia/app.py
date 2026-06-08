from flask import Flask, jsonify, request
from flask_cors import CORS
from clustering import executar_dbscan
from estatisticas import gerar_estatisticas
from supabase import create_client
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_KEY'),
)

_IA_KEY = os.getenv('IA_SERVICE_KEY')

def requer_chave(f):
    @wraps(f)
    def _inner(*args, **kwargs):
        if _IA_KEY:
            auth = request.headers.get('Authorization', '')
            if not auth.startswith('Bearer ') or auth[7:] != _IA_KEY:
                return jsonify({'erro': 'Não autorizado'}), 401
        return f(*args, **kwargs)
    return _inner

@app.get('/clusters')
@requer_chave
def clusters():
    try:
        return jsonify(executar_dbscan(supabase_client))
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.get('/estatisticas')
@requer_chave
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
