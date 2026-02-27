import { getServerSession } from "next-auth";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { authOptions } from "../auth/[...nextauth]";
import { ddb } from "../../../lib/dynamo";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const TABLE = process.env.DYNAMO_TABLE_PHOTOS;
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (
    !session ||
    !session.user ||
    session.user.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()
  ) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const { key, albumCode } = req.body || {};
  if (!key || !albumCode) {
    return res.status(400).json({ error: "Missing key or albumCode" });
  }

  try {
    // 1) Apaga o objeto do S3
    const delCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3.send(delCommand);

    // 2) Marca deletedAt no(s) item(ns) do DynamoDB para esse albumCode + s3Key
    //    Primeiro buscamos os itens desse álbum com esse s3Key
    const query = new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "albumCode = :code",
      FilterExpression: "s3Key = :s3key",
      ExpressionAttributeValues: {
        ":code": albumCode,
        ":s3key": key,
      },
    });

    const data = await ddb.send(query);

    const now = new Date().toISOString();

    // Para cada item encontrado, faz um Update marcando deletedAt
    const updates = (data.Items || []).map((item) => {
      return ddb.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: {
            albumCode: item.albumCode,
            photoKey: item.photoKey,
          },
          UpdateExpression: "SET deletedAt = :deletedAt",
          ExpressionAttributeValues: {
            ":deletedAt": now,
          },
        })
      );
    });

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return res.status(500).json({ error: "Failed to delete photo" });
  }
}
