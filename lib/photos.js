// lib/photos.js
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./dynamo";

const TABLE = process.env.DYNAMO_TABLE_PHOTOS;

export async function listPhotosByAlbum(albumCode) {
  const command = new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "albumCode = :code",
    ExpressionAttributeValues: {
      ":code": albumCode,
    },
    ScanIndexForward: true,
  });

  const res = await ddb.send(command);
  const items = res.Items || [];

  // Filtra fotos que não foram marcadas como deletadas
  return items.filter((item) => !item.deletedAt);
}
