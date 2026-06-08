from collections import Counter

def gerar_estatisticas(supabase_client):
    pets = supabase_client.table('pets_perdidos') \
        .select('especie, status') \
        .execute().data

    total_perdidos    = sum(1 for p in pets if p['status'] == 'perdido')
    total_encontrados = sum(1 for p in pets if p['status'] == 'encontrado')

    por_especie = [
        {'especie': k, 'total': v}
        for k, v in Counter(p['especie'] for p in pets if p['status'] == 'perdido').most_common()
    ]

    return {
        'total_perdidos':    total_perdidos,
        'total_encontrados': total_encontrados,
        'por_especie':       por_especie,
    }
