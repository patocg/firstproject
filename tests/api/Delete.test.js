import handler from "../../pages/api/album/delete";
import { getServerSession } from "next-auth";
import { ddb } from "../../lib/dynamo";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../lib/dynamo", () => ({ ddb: { send: jest.fn() } }));
jest.mock("@aws-sdk/lib-dynamodb", () => ({
  GetCommand: jest.fn().mockImplementation((p) => p),
  UpdateCommand: jest.fn().mockImplementation((p) => p),
  QueryCommand: jest.fn().mockImplementation((p) => p),
}));
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  DeleteObjectCommand: jest.fn().mockImplementation((p) => p),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /api/album/delete", () => {
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
      { method: "POST", body: { key: "albuns/012025/foto.jpg", albumCode: "012025" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 403 quando usuário não tem canDeletePhotos", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockResolvedValueOnce({ Item: { canDeletePhotos: false } });
    const res = mockRes();
    await handler(
      { method: "POST", body: { key: "albuns/012025/foto.jpg", albumCode: "012025" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 403 quando DynamoDB falha na verificação de permissão", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@test.com" } });
    ddb.send.mockRejectedValueOnce(new Error("DynamoDB error"));
    const res = mockRes();
    await handler(
      { method: "POST", body: { key: "albuns/012025/foto.jpg", albumCode: "012025" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 400 quando key está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler({ method: "POST", body: { albumCode: "012025" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 quando albumCode está ausente", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler(
      { method: "POST", body: { key: "albuns/012025/foto.jpg" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 200 quando owner deleta foto com soft-delete no DynamoDB", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    ddb.send.mockResolvedValueOnce({ Items: [] }); // QueryCommand sem itens
    const res = mockRes();
    await handler(
      { method: "POST", body: { key: "albuns/012025/foto.jpg", albumCode: "012025" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("retorna 200 quando usuário com canDeletePhotos deleta foto", async () => {
    getServerSession.mockResolvedValue({ user: { email: "autorizado@test.com" } });
    ddb.send
      .mockResolvedValueOnce({ Item: { canDeletePhotos: true } }) // whitelist check
      .mockResolvedValueOnce({ Items: [] }); // QueryCommand
    const res = mockRes();
    await handler(
      { method: "POST", body: { key: "albuns/012025/foto.jpg", albumCode: "012025" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
