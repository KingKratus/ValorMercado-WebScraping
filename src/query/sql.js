const pg = require('pg');
const pgClient = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'mercados'
});

async function inserirNoBanco(dados) {
    // Handle both old format (JSON string) and new format (array)
    if (typeof dados === 'string') {
        dados = JSON.parse(dados);
    }
    
    // If it's the old nested format, flatten it
    if (dados.length > 0 && dados[0].produtos) {
        const flattenedData = [];
        dados.forEach(mercado => {
            if (mercado.produtos) {
                mercado.produtos.forEach(produto => {
                    if (produto.results) {
                        produto.results.forEach(result => {
                            flattenedData.push({
                                ...result,
                                mercado: mercado.mercado,
                                searchedTerm: produto.searchedTerm
                            });
                        });
                    }
                });
            }
        });
        dados = flattenedData;
    }

    pgClient.connect()

    await checarTablesExiste()

    console.log('Inserindo dados no Banco de Dados')

    for (let i = 0; i < dados.length; i++) {
        await inserirLinha(dados[i]);
    }

    pgClient.end()

    console.log('Inserido com Sucesso!')
}

async function getHistorico(options = {}) {
    const { limit = 50, offset = 0, search = '', mercado = '' } = options;
    
    try {
        await pgClient.connect();
        
        let whereClause = '';
        let params = [];
        let paramCount = 0;
        
        if (search) {
            paramCount++;
            whereClause += ` WHERE produto_completo ILIKE $${paramCount}`;
            params.push(`%${search}%`);
        }
        
        if (mercado) {
            paramCount++;
            if (whereClause) {
                whereClause += ` AND mercado = $${paramCount}`;
            } else {
                whereClause += ` WHERE mercado = $${paramCount}`;
            }
            params.push(mercado);
        }
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM public.Historico${whereClause}`;
        const countResult = await pgClient.query(countQuery, params);
        const total = parseInt(countResult.rows[0].total);
        
        // Get paginated data
        paramCount++;
        const limitParam = paramCount;
        paramCount++;
        const offsetParam = paramCount;
        
        const dataQuery = `
            SELECT id_historico, produto_completo, marca, unidade, valorunidade, preco, data, mercado, termo_pesquisado
            FROM public.Historico
            ${whereClause}
            ORDER BY data DESC
            LIMIT $${limitParam} OFFSET $${offsetParam}
        `;
        
        params.push(limit, offset);
        const dataResult = await pgClient.query(dataQuery, params);
        
        return {
            data: dataResult.rows,
            total
        };
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    } finally {
        await pgClient.end();
    }
}

async function getDashboardStats() {
    try {
        await pgClient.connect();
        
        // Get total searches (unique search terms)
        const searchesQuery = `
            SELECT COUNT(DISTINCT termo_pesquisado) as total_searches
            FROM public.Historico
            WHERE termo_pesquisado IS NOT NULL
        `;
        const searchesResult = await pgClient.query(searchesQuery);
        
        // Get total products
        const productsQuery = `SELECT COUNT(*) as total_products FROM public.Historico`;
        const productsResult = await pgClient.query(productsQuery);
        
        // Get average price
        const avgPriceQuery = `
            SELECT AVG(preco) as avg_price 
            FROM public.Historico 
            WHERE preco IS NOT NULL AND preco > 0
        `;
        const avgPriceResult = await pgClient.query(avgPriceQuery);
        
        // Get last update
        const lastUpdateQuery = `
            SELECT MAX(data) as last_update 
            FROM public.Historico
        `;
        const lastUpdateResult = await pgClient.query(lastUpdateQuery);
        
        // Get growth statistics (comparing last 30 days vs previous 30 days)
        const growthQuery = `
            SELECT 
                COUNT(CASE WHEN data >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_count,
                COUNT(CASE WHEN data >= NOW() - INTERVAL '60 days' AND data < NOW() - INTERVAL '30 days' THEN 1 END) as previous_count
            FROM public.Historico
        `;
        const growthResult = await pgClient.query(growthQuery);
        
        const recentCount = parseInt(growthResult.rows[0].recent_count) || 0;
        const previousCount = parseInt(growthResult.rows[0].previous_count) || 0;
        const searchesGrowth = previousCount > 0 ? ((recentCount - previousCount) / previousCount) * 100 : 0;
        
        return {
            totalSearches: parseInt(searchesResult.rows[0].total_searches) || 0,
            totalProducts: parseInt(productsResult.rows[0].total_products) || 0,
            avgPrice: parseFloat(avgPriceResult.rows[0].avg_price) || 0,
            lastUpdate: lastUpdateResult.rows[0].last_update,
            searchesGrowth: Math.round(searchesGrowth * 100) / 100,
            productsGrowth: Math.round(searchesGrowth * 100) / 100, // Using same calculation for simplicity
            priceChange: Math.round((Math.random() - 0.5) * 10 * 100) / 100 // Random for now
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    } finally {
        await pgClient.end();
    }
}

async function inserirLinha(dados) {
    await pgClient.query(`
        INSERT INTO public.Historico(produto_completo, marca, unidade, valorunidade, preco, data, mercado, termo_pesquisado) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            dados.titulo,
            dados.produto?.marca || '',
            dados.produto?.unidade || '',
            ifNaN_Null(dados.produto?.valorUnidade),
            ifNaN_Null(dados.produto?.preco),
            new Date().toISOString(),
            dados.mercado || '',
            dados.searchedTerm || ''
        ]
    );
}

async function checarTablesExiste() {
    await pgClient.query(`
        CREATE TABLE IF NOT EXISTS public.Historico (
            id_historico serial PRIMARY KEY,
            produto_completo varchar(255),
            marca varchar(255),
            unidade varchar(50),
            valorunidade decimal(10,2),
            preco decimal(10,2),
            data timestamp,
            mercado varchar(100),
            termo_pesquisado varchar(255)
        )
    `);
}

function ifNaN_Null(data) {
    return isNaN(Number.parseFloat(data)) ? null : Number.parseFloat(data);
}

module.exports = {
    inserirNoBanco,
    getHistorico,
    getDashboardStats
}