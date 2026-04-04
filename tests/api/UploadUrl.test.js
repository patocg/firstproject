import handler from "../../pages/api/album/upload-url";
import { getServerSession } from "next-auth";
import { ddb } from "../../lib/dynamo";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../lib/dynamo", () => ({ ddb: { send: jest.fn() } }));
jest.mock("@aws-sdk/lib-dynamodb", () => ({
  GetCommand: jest.fn().mockImplementation((p) => p),
}));
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({})),
  PutObjectCommand: jest.fn().mockImplementation((p) => p),
}));
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /api/album/upload-url", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna 405 para método não-POST", async () => {
    const res = mockRes();
    await handler({ method: "GET" }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("retorna 401 quando não há sessão autenticada", async () => {
    getServerSession.mockResolvedValue(null);
    const res = mockRes();
    await handler(
      { method: "POST", body: { fileName: "foto.jpg", fileType: "image/jpeg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 403 quando usuário não tem canUploadPhotos", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockResolvedValueOnce({ Item: { canUploadPhotos: false } });
    const res = mockRes();
    await handler(
      { method: "POST", body: { fileName: "foto.jpg", fileType: "image/jpeg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 403 quando DynamoDB falha na verificação de permissão", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockRejectedValueOnce(new Error("DynamoDB error"));
    const res = mockRes();
    await handler(
      { method: "POST", body: { fileName: "foto.jpg", fileType: "image/jpeg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 400 quando fileName está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler({ method: "POST", body: { fileType: "image/jpeg" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 quando fileType está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler({ method: "POST", body: { fileName: "foto.jpg" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 200 com uploadUrl e key quando owner faz requisição válida", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    getSignedUrl.mockResolvedValue("https://s3.mock/presigned-url");
    const res = mockRes();
    await handler(
      {
        method: "POST",
        body: {
          fileName: "foto.jpg",
          fileType: "image/jpeg",
          s3Key: "albuns/012025/foto.jpg",
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadUrl: "https://s3.mock/presigned-url",
        key: "albuns/012025/foto.jpg",
      })
    );
  });

  it("retorna 200 quando usuário tem canUploadPhotos", async () => {
    getServerSession.mockResolvedValue({ user: { email: "autorizado@test.com" } });
    ddb.send.mockResolvedValueOnce({ Item: { canUploadPhotos: true } });
    getSignedUrl.mockResolvedValue("https://s3.mock/presigned-url");
    const res = mockRes();
    await handler(
      {
        method: "POST",
        body: {
          fileName: "foto.jpg",
          fileType: "image/jpeg",
          s3Key: "albuns/012025/foto.jpg",
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
