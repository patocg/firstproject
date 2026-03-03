// ============================================================================
// lib/photos.js
// ============================================================================
// Responsável: Operações de leitura e filtragem de fotos no DynamoDB
// Tabela usada: photos (contém todas as fotos de todos os álbuns)
// Estrutura esperada do item:
//   - albumCode: código do álbum (ex: "202312" para dezembro/2023)
//   - photoKey: chave da foto no S3
//   - deletedAt: data de exclusão (null = foto ativa, ISO string = deletada)
// ============================================================================

// Importa o comando QueryCommand do SDK v3 do DynamoDB
// QueryCommand é usado para buscar itens usando a Primary Key (mais eficiente que Scan)
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

// Importa o cliente do DynamoDB já configurado (região, credentials, etc.)
import { ddb } from "./dynamo";

// Importa o logger para registrar informações e erros de forma controlada
import { logger } from './logger';

// Nome da tabela de fotos, vem da variável de ambiente
// Ex: "photos", "myapp-photos-dev", etc.
const TABLE = process.env.DYNAMO_TABLE_PHOTOS;

/**
 * Lista todas as fotos de um álbum específico
 * 
 * @param {string} albumCode - Código do álbum no formato "AAAAMM" (ex: "202312")
 * @returns {Promise<Array>} Array de fotos ativas (não deletadas) do álbum
 * 
 * COMO FUNCIONA:
 * 1. Usa QueryCommand para buscar todos os itens onde albumCode = código informado
 * 2. Query é mais eficiente que Scan porque usa a Primary Key da tabela
 * 3. Filtra no JavaScript apenas fotos onde deletedAt é null/undefined (fotos vivas)
 * 4. Lida com paginação automática (DynamoDB retorna máx 1MB por query)
 */
export async function listPhotosByAlbum(albumCode) {
    // Array para armazenar TODAS as fotos (incluindo múltiplas páginas)
    let allItems = [];
    
    // Variável para controlar a paginação
    // LastEvaluatedKey vem do DynamoDB quando há mais dados para buscar
    let lastEvaluatedKey = undefined;
    let iteration = 0; // Contador de páginas para o log

    // 🔵 LOG 1: Início da busca (saber qual álbum está sendo carregado)
    logger.debug(`Buscando fotos do álbum: ${albumCode}`);
    
        // Loop que continua enquanto houver mais páginas de resultados
    // O DynamoDB retorna no máximo 1MB de dados por Query/Scan
    // Se tiver mais dados, retorna LastEvaluatedKey para continuar de onde parou
    do {
        iteration++; // Incrementa o contador de páginas
        // Cria o comando de Query com os parâmetros:
        const command = new QueryCommand({
            TableName: TABLE,                    // Nome da tabela
            KeyConditionExpression: "albumCode = :code",  // Busca por albumCode
            ExpressionAttributeValues: {
                ":code": albumCode,              // Valor do albumCode a buscar
            },
            ScanIndexForward: true,              // true = ordem crescente, false = decrescente
            ExclusiveStartKey: lastEvaluatedKey, // Continua da última posição (paginação)
        });

        // 🔵 LOG 2: Antes de executar a query (saber se tem paginação)
       logger.debug(`Página ${iteration} - Executando Query`);

        // Executa a query no DynamoDB
        const res = await ddb.send(command);
        
        // Adiciona os itens retornados nesta página ao array principal
        // Items pode ser undefined se não houver resultados
        allItems = allItems.concat(res.Items || []);
        
        // Atualiza lastEvaluatedKey com a posição atual
        // Se for undefined, o loop termina (última página)
        lastEvaluatedKey = res.LastEvaluatedKey;

        // 🔵 LOG 3: Após receber resposta (quantos itens vieram nesta página)
        logger.debug(`Página ${iteration} - Recebidos: ${res.Items?.length || 0} itens`);

        // Log opcional para debug (remover em produção)
        // console.log(`Página processada. Total acumulado: ${allItems.length} fotos`);

    } while (lastEvaluatedKey); // Enquanto houver mais páginas, continua

    // Filtra as fotos para retornar APENAS as ativas (não deletadas)
    // deletedAt é null/undefined para fotos ativas
    // deletedAt é uma string ISO (ex: "2024-01-15T10:30:00Z") para fotos deletadas
    const activePhotos = allItems.filter((item) => !item.deletedAt);

    // 🔵 LOG 4: Resultado final (quantas fotos ativas após filtrar deletadas)
    logger.info(`Álbum ${albumCode} - Total: ${activePhotos.length} fotos ativas`);

    // Retorna apenas as fotos ativas
    return activePhotos;
}
