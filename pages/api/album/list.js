import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const prefix = process.env.AWS_S3_ALBUM_PREFIX || "album/";

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Listing S3 objects from bucket:", bucket, "prefix:", prefix);

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const data = await s3.send(command);
    console.log("S3 ListObjectsV2 result:", JSON.stringify(data, null, 2));

    const contents = data.Contents || [];

    const items = await Promise.all(
      contents
        .filter((obj) => obj.Key && obj.Key !== prefix)
        .map(async (obj) => {
          const getObjectParams = {
            Bucket: bucket,
            Key: obj.Key,
          };

          const url = await getSignedUrl(
            s3,
            new GetObjectCommand(getObjectParams),
            { expiresIn: 300 } // 5 minutos
          );

          return {
            key: obj.Key,
            url,
            lastModified: obj.LastModified,
            size: obj.Size,
          };
        })
    );

    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error listing S3 album:", error);
    return res.status(500).json({ error: "Failed to list album" });
  }
}
