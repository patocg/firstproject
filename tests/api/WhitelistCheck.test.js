import handler from "../../pages/api/whitelist/check";
import { getServerSession } from "next-auth";
import { ddb } from "../../lib/dynamo";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("../../pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../lib/dynamo", () => ({ ddb: { send: jest.fn() } }));
jest.mock("@aws-sdk/lib-dynamodb", () => ({
  GetCommand: jest.fn().mockImplementation((p) => p),
}));
jest.mock("../../lib/logger", () => ({
  logger: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
  maskEmail: jest.fn((e) => e),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /api/whitelist/check", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna 405 para método não-POST", async () => {
    const res = mockRes();
    await handler({ method: "GET", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("retorna 401 quando não há sessão autenticada", async () => {
    getServerSession.mockResolvedValue(null);
    const res = mockRes();
    await handler({ method: "POST", body: { email: "alguem@test.com" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 400 quando e-mail não é fornecido no body", async () => {
    getServerSession.mockResolvedValue({ user: { email: "alguem@test.com" } });
    const res = mockRes();
    await handler({ method: "POST", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna allowed=true e owner=true para o dono sem consultar o DynamoDB", async () => {
    getServerSession.mockResolvedValue({ user: { email: process.env.OWNER_EMAIL } });
    const res = mockRes();
    await handler(
      { method: "POST", body: { email: process.env.OWNER_EMAIL } },
      res
    );
    expect(ddb.send).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ allowed: true, owner: true })
    );
  });

  it("retorna allowed=false quando e-mail não está na whitelist", async () => {
    getServerSession.mockResolvedValue({ user: { email: "naoexiste@test.com" } });
    ddb.send.mockResolvedValueOnce({ Item: null });
    const res = mockRes();
    await handler(
      { method: "POST", body: { email: "naoexiste@test.com" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ allowed: false, owner: false, permissions: null })
    );
  });

  it("retorna allowed=true com permissões corretas para usuário ativo na whitelist", async () => {
    getServerSession.mockResolvedValue({ user: { email: "autorizado@test.com" } });
    ddb.send.mockResolvedValueOnce({
      Item: {
        email: "autorizado@test.com",
        isActive: true,
        canViewAlbums: true,
        canUploadPhotos: true,
        canDeletePhotos: false,
        canEditProfile: false,
      },
    });
    const res = mockRes();
    await handler(
      { method: "POST", body: { email: "autorizado@test.com" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        allowed: true,
        owner: false,
        permissions: expect.objectContaining({
          canUploadPhotos: true,
          canDeletePhotos: false,
        }),
      })
    );
  });

  it("retorna allowed=false para usuário inativo mesmo estando na whitelist", async () => {
    getServerSession.mockResolvedValue({ user: { email: "inativo@test.com" } });
    ddb.send.mockResolvedValueOnce({
      Item: { email: "inativo@test.com", isActive: false, canViewAlbums: true },
    });
    const res = mockRes();
    await handler(
      { method: "POST", body: { email: "inativo@test.com" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ allowed: false })
    );
  });

  it("retorna 500 quando DynamoDB lança erro", async () => {
    getServerSession.mockResolvedValue({ user: { email: "alguem@test.com" } });
    ddb.send.mockRejectedValueOnce(new Error("DynamoDB timeout"));
    const res = mockRes();
    await handler(
      { method: "POST", body: { email: "alguem@test.com" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
