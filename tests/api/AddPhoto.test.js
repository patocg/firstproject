import handler from "../../pages/api/album/add-photo";
import { getServerSession } from "next-auth";
import { ddb } from "../../lib/dynamo";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../lib/dynamo", () => ({ ddb: { send: jest.fn() } }));
jest.mock("@aws-sdk/lib-dynamodb", () => ({
  GetCommand: jest.fn().mockImplementation((p) => p),
  PutCommand: jest.fn().mockImplementation((p) => p),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /api/album/add-photo", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna 405 para método não-POST", async () => {
    const res = mockRes();
    await handler({ method: "GET" }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("retorna 401 quando não há sessão autenticada", async () => {
    getServerSession.mockResolvedValue(null);
    const res = mockRes();
    await handler({ method: "POST", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 403 quando usuário não tem canUploadPhotos", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockResolvedValueOnce({ Item: { canUploadPhotos: false } });
    const res = mockRes();
    await handler(
      { method: "POST", body: { albumCode: "012025", s3Key: "albuns/012025/foto.jpg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 403 quando DynamoDB falha na verificação de permissão", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockRejectedValueOnce(new Error("DynamoDB error"));
    const res = mockRes();
    await handler(
      { method: "POST", body: { albumCode: "012025", s3Key: "albuns/012025/foto.jpg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 400 quando albumCode está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler({ method: "POST", body: { s3Key: "albuns/012025/foto.jpg" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 quando s3Key está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler({ method: "POST", body: { albumCode: "012025" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 200 e salva metadados quando chamado pelo owner", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    ddb.send.mockResolvedValueOnce({});
    const res = mockRes();
    await handler(
      {
        method: "POST",
        body: { albumCode: "012025", s3Key: "albuns/012025/foto.jpg", takenDate: "2025-01-15" },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("retorna 200 quando usuário tem canUploadPhotos", async () => {
    getServerSession.mockResolvedValue({ user: { email: "autorizado@test.com" } });
    ddb.send
      .mockResolvedValueOnce({ Item: { canUploadPhotos: true } })
      .mockResolvedValueOnce({});
    const res = mockRes();
    await handler(
      { method: "POST", body: { albumCode: "012025", s3Key: "albuns/012025/foto.jpg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
