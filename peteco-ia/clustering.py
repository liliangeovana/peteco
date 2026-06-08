import numpy as np
from sklearn.cluster import DBSCAN

def executar_dbscan(supabase_client, eps_km=1.0, min_samples=3):
    resultado = supabase_client.table('pets_perdidos') \
        .select('id, nome, especie, bairro, lat, lng') \
        .eq('status', 'perdido') \
        .execute()

    pets = [p for p in resultado.data if p.get('lat') and p.get('lng')]

    if len(pets) < min_samples:
        return {
            'total_clusters': 0,
            'total_ruido': len(pets),
            'parametros': {'eps_km': eps_km, 'min_samples': min_samples},
            'clusters': [],
            'aviso': f'Dados insuficientes ({len(pets)} pets com localização, mínimo {min_samples})',
        }

    coords  = np.array([[p['lat'], p['lng']] for p in pets])
    eps_rad = eps_km / 6371.0

    modelo  = DBSCAN(eps=eps_rad, min_samples=min_samples,
                     algorithm='ball_tree', metric='haversine')
    rotulos = modelo.fit_predict(np.radians(coords))

    grupos = {}
    for i, rotulo in enumerate(rotulos):
        grupos.setdefault(int(rotulo), []).append({
            'id':      pets[i]['id'],
            'nome':    pets[i]['nome'],
            'especie': pets[i]['especie'],
            'bairro':  pets[i].get('bairro'),
            'lat':     pets[i]['lat'],
            'lng':     pets[i]['lng'],
        })

    clusters_finais = []
    for rotulo, membros in grupos.items():
        if rotulo == -1:
            continue
        lats = [m['lat'] for m in membros]
        lngs = [m['lng'] for m in membros]
        clusters_finais.append({
            'cluster_id':    rotulo,
            'total_pets':    len(membros),
            'centroide_lat': float(np.mean(lats)),
            'centroide_lng': float(np.mean(lngs)),
            'criticidade':   'alta' if len(membros) >= 5 else ('media' if len(membros) >= 3 else 'baixa'),
            'pets':          membros,
        })

    clusters_finais.sort(key=lambda x: x['total_pets'], reverse=True)

    return {
        'total_clusters': len(clusters_finais),
        'total_ruido':    len(grupos.get(-1, [])),
        'parametros':     {'eps_km': eps_km, 'min_samples': min_samples},
        'clusters':       clusters_finais,
    }
