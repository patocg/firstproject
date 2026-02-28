// ============================================================================
// pages/api/album/list-albums.js
// ============================================================================
// Rota da API: GET /api/album/list-albums
// Responsável: Listar todos os álbuns que possuem pelo menos UMA foto ativa
// Retorna: Array de códigos de álbuns únicos (ex: ["202312", "202401", "202402"])
// ============================================================================

// Importa o comando Scan do DynamoDB DocumentClient v3
// ScanCommand lê TODOS os itens da tabela (diferente de Query que usa Primary Key)
// É necessário usar Scan aqui porque queremos varrer toda a tabela para encontrar
// álbuns únicos, não estamos buscando por uma chave específica
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// Importa o cliente do DynamoDB já configurado
// Arquivo contém: região, credentials, endpoint (se LocalStack/DynamoDB Local)
import { ddb } from "../../../lib/dynamo";

// Nome da tabela de fotos, vem da variável de ambiente
// Deve ser a mesma tabela usada no photos.js
const TABLE = process.env.DYNAMO_TABLE_PHOTOS;

/**
 * Handler da rota GET /api/album/list-albums
 * 
 * @param {Object} req - Requisição HTTP (Next.js API)
 * @param {Object} res - Resposta HTTP (Next.js API)
 * 
 * O QUE FAZ:
 * 1. Varre toda a tabela photos usando ScanCommand
 * 2. Coleta códigos únicos de álbuns que têm pelo menos 1 foto ativa
 * 3. Ignora fotos deletadas (deletedAt preenchido)
 * 4. Retorna lista ordenada de códigos de álbuns
 * 
 * POR QUE USAR SCAN AQUI:
 * - Precisamos varrer TODA a tabela, não há como usar Query sem uma Primary Key específica
 * - Queremos descobrir quais álbuns existem, não buscar um álbum específico
 */
export default async function handler(req, res) {
    // ========================================================================
    // VALIDAÇÃO DO MÉTODO HTTP
    // ========================================================================
    // Esta API só aceita requisições GET
    // Se tentar usar POST, PUT, DELETE, etc., retorna erro 405
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // 🔵 LOG 1: Início do processo de listagem
        console.log(`[list-albums.js] Iniciando listagem de álbuns - Tabela: ${TABLE}`);
        // ====================================================================
        // COLETA DE ÁLBUNS ATIVOS COM PAGINAÇÃO
        // ====================================================================
        // Usamos Set em vez de Array para evitar duplicatas automaticamente
        // Um álbum pode ter centenas de fotos, mas queremos o código apenas uma vez
        const aliveAlbums = new Set();
        
        // Variável para controlar a paginação do Scan
        // LastEvaluatedKey indica onde parar na próxima iteração
        let lastEvaluatedKey = undefined;
        let iteration = 0; // Contador de páginas para o log

        // 🔵 LOG 2: Início do Scan
        console.log(`[list-albums.js] Iniciando Scan no DynamoDB...`);

        // Loop de paginação: executa enquanto houver mais dados
        // O DynamoDB retorna no máximo 1MB por Scan, então precisamos de loop
        do {
            // Cria o comando de Scan com:
            iteration++; // Incrementa contador de páginas
            const command = new ScanCommand({
                TableName: TABLE,                    // Nome da tabela
                ProjectionExpression: "albumCode, deletedAt",  // Campos a retornar
                // ProjectionExpression otimiza a query trazendo apenas o necessário
                // Reduz custo de leitura e melhora performance
                
                ExclusiveStartKey: lastEvaluatedKey, // Continua da última posição
                // Na primeira execução é undefined, então começa do início
            });

            // 🔵 LOG 3: Antes de executar cada página do Scan
            console.log(`[list-albums.js] Página ${iteration} - Executando Scan...`);

            // Executa o Scan no DynamoDB
            const data = await ddb.send(command);
            
            // =================================================================
            // PROCESSAMENTO DOS ITENS DESTA PÁGINA
            // =================================================================
            // Itera sobre cada foto retornada nesta página do Scan
            for (const item of data.Items || []) {
                // Verifica se a foto atende aos critérios:
                // 1. Tem albumCode definido (existe um álbum associado)
                // 2. NÃO tem deletedAt (foto ainda não foi deletada)
                //    - deletedAt = null/undefined → foto ativa
                //    - deletedAt = string ISO → foto deletada logicamente
                if (item.albumCode && !item.deletedAt) {
                    // Adiciona o código do álbum ao Set
                    // Set automaticamente ignora duplicatas
                    // Ex: se "202312" já existe, não adiciona novamente
                    aliveAlbums.add(item.albumCode);
                }
            }

            // =================================================================
            // ATUALIZA PONTEIRO DE PAGINAÇÃO
            // =================================================================
            // LastEvaluatedKey contém a chave do último item processado
            // Se for undefined, significa que chegamos ao final da tabela
            lastEvaluatedKey = data.LastEvaluatedKey;

            // 🔵 LOG 4: Após processar cada página
            console.log(
                `[list-albums.js] Página ${iteration} - ` +
                `Itens nesta página: ${data.Items?.length || 0} | ` +
                `Álbuns únicos encontrados: ${aliveAlbums.size} | ` +
                `Mais páginas: ${!!lastEvaluatedKey}`
            );

            // Log opcional para debug (útil para testar paginação)
            // console.log(`Página Scan processada. Álbuns únicos encontrados: ${aliveAlbums.size}`);
            // console.log(`Há mais páginas? ${!!lastEvaluatedKey}`);

        } while (lastEvaluatedKey); // Continua enquanto houver mais páginas

        // ====================================================================
        // PREPARAÇÃO DA RESPOSTA
        // ====================================================================
        // Converte o Set para Array
        // Set não tem ordem garantida, então ordenamos alfabeticamente/numericamente
        // Ex: ["202401", "202312", "202402"] → ["202312", "202401", "202402"]
        const albums = Array.from(aliveAlbums).sort();

        // 🔵 LOG 5: Resultado final da listagem
        console.log(
            `[list-albums.js] Conclusão - ` +
            `Total de páginas processadas: ${iteration} | ` +
            `Álbuns únicos encontrados: ${albums.length} | ` +
            `Álbuns: ${JSON.stringify(albums)}`
        );

        // Retorna resposta de sucesso com a lista de álbuns
        // Formato esperado pelo front-end em pages/album.js
        return res.status(200).json({ albums });

    } catch (err) {
        // 🔵 LOG 6: Em caso de erro
        console.error(`[list-albums.js] ERRO na listagem de álbuns:`, err);
        
        return res.status(500).json({
            error: "Erro ao listar álbuns",
            details: err.message || String(err),
        });
        // ====================================================================
        // TRATAMENTO DE ERROS
        // ====================================================================
        // Loga o erro no servidor (aparece nos logs da Vercel/CloudWatch)
        console.error("Erro ao listar álbuns:", err);
        
        // Retorna erro 500 para o cliente com detalhes
        // Em produção, evite expor detalhes internos do erro
        return res.status(500).json({
            error: "Erro ao listar álbuns",
            details: err.message || String(err),
        });
    }
}
