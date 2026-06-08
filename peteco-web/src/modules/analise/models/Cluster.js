/**
 * @typedef {{
 *   cluster_id:    number,
 *   centroide_lat: number,
 *   centroide_lng: number,
 *   total_pets:    number,
 *   criticidade:   'alta' | 'media' | 'baixa',
 *   pets:          import('../../pet/models/Pet.js').Pet[],
 * }} Cluster
 *
 * @typedef {{
 *   total_clusters: number,
 *   total_ruido:    number,
 *   clusters:       Cluster[],
 *   parametros:     { eps_km: number, min_samples: number },
 * }} ResultadoClusters
 */
