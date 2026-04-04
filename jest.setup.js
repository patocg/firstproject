import "@testing-library/jest-dom";
import "whatwg-fetch";

// next/jest does not load .env.local in test mode — set defaults for module-level constants
process.env.AWS_REGION = process.env.AWS_REGION || "sa-east-1";
process.env.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "test-bucket";
process.env.DYNAMO_TABLE_WHITELIST = process.env.DYNAMO_TABLE_WHITELIST || "whitelist";
process.env.DYNAMO_TABLE_PHOTOS = process.env.DYNAMO_TABLE_PHOTOS || "photos";
process.env.OWNER_EMAIL = process.env.OWNER_EMAIL || "jonathas.lima.cunha@gmail.com";
