import { listPhotosByAlbum } from "../../lib/photos";
import { ddb } from "../../lib/dynamo";

jest.mock("../../lib/dynamo", () => ({ ddb: { send: jest.fn() } }));
jest.mock("@aws-sdk/lib-dynamodb", () => ({
  QueryCommand: jest.fn().mockImplementation((p) => p),
}));
jest.mock("../../lib/logger", () => ({
  logger: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

describe("listPhotosByAlbum", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna apenas fotos ativas (deletedAt null) do álbum", async () => {
    ddb.send.mockResolvedValueOnce({
      Items: [
        { albumCode: "012025", photoKey: "p1", s3Key: "foto1.jpg", deletedAt: null },
        { albumCode: "012025", photoKey: "p2", s3Key: "foto2.jpg", deletedAt: null },
      ],
      LastEvaluatedKey: undefined,
    });

    const result = await listPhotosByAlbum("012025");

    expect(result).toHaveLength(2);
    expect(result[0].s3Key).toBe("foto1.jpg");
  });

  it("filtra fotos com deletedAt preenchido (soft delete)", async () => {
    ddb.send.mockResolvedValueOnce({
      Items: [
        { albumCode: "012025", photoKey: "p1", s3Key: "ativa.jpg", deletedAt: null },
        { albumCode: "012025", photoKey: "p2", s3Key: "deletada.jpg", deletedAt: "2025-03-01T00:00:00Z" },
        { albumCode: "012025", photoKey: "p3", s3Key: "ativa2.jpg", deletedAt: null },
      ],
      LastEvaluatedKey: undefined,
    });

    const result = await listPhotosByAlbum("012025");

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.s3Key)).toEqual(["ativa.jpg", "ativa2.jpg"]);
  });

  it("percorre múltiplas páginas retornando todos os itens (paginação)", async () => {
    ddb.send
      .mockResolvedValueOnce({
        Items: [{ albumCode: "012025", photoKey: "p1", s3Key: "foto1.jpg", deletedAt: null }],
        LastEvaluatedKey: { albumCode: "012025", photoKey: "p1" },
      })
      .mockResolvedValueOnce({
        Items: [{ albumCode: "012025", photoKey: "p2", s3Key: "foto2.jpg", deletedAt: null }],
        LastEvaluatedKey: undefined,
      });

    const result = await listPhotosByAlbum("012025");

    expect(ddb.send).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.s3Key)).toEqual(["foto1.jpg", "foto2.jpg"]);
  });

  it("retorna array vazio quando álbum não tem fotos", async () => {
    ddb.send.mockResolvedValueOnce({
      Items: [],
      LastEvaluatedKey: undefined,
    });

    const result = await listPhotosByAlbum("012025");

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("retorna array vazio quando todas as fotos do álbum foram deletadas", async () => {
    ddb.send.mockResolvedValueOnce({
      Items: [
        { albumCode: "012025", photoKey: "p1", s3Key: "foto1.jpg", deletedAt: "2025-01-01T00:00:00Z" },
        { albumCode: "012025", photoKey: "p2", s3Key: "foto2.jpg", deletedAt: "2025-01-02T00:00:00Z" },
      ],
      LastEvaluatedKey: undefined,
    });

    const result = await listPhotosByAlbum("012025");

    expect(result).toHaveLength(0);
  });
});
