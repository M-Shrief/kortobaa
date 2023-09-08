import { assert } from "chai";
import { describe, it } from "mocha";
// Utils
import { baseHttp } from "../axios";
import HttpStatusCode from "../../utils/httpStatusCode";
// Types
import { AxiosError } from "axios";
import { ERROR_MSG, Poem } from "../../components/poem/poem.entity";

describe("GET /poems", async () => {
  it("Responds with the right JSON body", async () => {
    const req = await baseHttp.get("poems");

    assert.strictEqual(req.status, HttpStatusCode.OK);
    const poems: Poem[] = req.data;

    assert.isArray(poems);
    assert.isDefined(poems[0].intro);
    assert.isDefined(poems[0].poet);
    assert.isDefined(poems[0].reviewed);
    assert.isArray(poems[0].verses);
  });
});

describe("GET /poem/:id", async () => {
  let poemId: string;
  before(async () => {
    const req = await baseHttp.get("poems");
    poemId = req.data[0].id;
  });
  it("Responds with the right JSON body", async () => {
    const req = await baseHttp.get(`poem/${poemId}`);

    assert.strictEqual(req.status, HttpStatusCode.OK);
    const poem: Poem = req.data;

    assert.isDefined(poem.id);
    assert.isDefined(poem.intro);
    assert.isDefined(poem.poet);
    assert.isDefined(poem.reviewed);
    assert.isArray(poem.verses);
  });
  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = poemId.replace(poemId[5], "a");
      await baseHttp.get(`poem/${corruptedId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(error.response!.status, HttpStatusCode.NOT_FOUND);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    }
  });

  it("gets 400 with wrong :id format", async () => {
    try {
      await baseHttp.get(`poem/22`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    }
  });
});

describe("POST /poems", () => {
  const data = [
    {
      intro: "testing2",
      poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    },
    {
      intro: "testing3",
      poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    },
    {
      poet: "639b5cf712eec0bb274cecd4",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    },
  ];
  const testPoemsId: string[] = [];
  afterEach(() => {
    testPoemsId.forEach(async (id) => {
      await baseHttp.delete(`poem/${id}`);
    });
  });
  it("it saves valid entries correctly, and returns valid & non-valid entries", async () => {
    const req = await baseHttp.post("/poems", data);
    const poemsIds = req.data.newPoems.map((poem: Poem) => poem.id);
    testPoemsId.push(...poemsIds);

    assert.strictEqual(req.status, HttpStatusCode.CREATED);

    assert.isNotEmpty(req.data.newPoems);
    assert.containsAllKeys(req.data.newPoems[0], data[0]);

    assert.isNotEmpty(req.data.nonValidPoems);
    assert.containsAllKeys(req.data.nonValidPoems[0], data[2]);
  });
});

describe("POST /poem", () => {
  it("it post valid data correctly", async () => {
    const data = {
      intro: "testing2",
      poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    };
    const req = await baseHttp.post("poem", data);

    assert.equal(req.status, HttpStatusCode.CREATED);
    assert.containsAllKeys(req.data, data);

    await baseHttp.delete(`poem/${req.data.id}`);
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp
      .post("/poem", {
        // "intro": "حسرةٌ ولَّت, و أخرى أقبلت",
        poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
        verses: [
          {
            first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
            sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
          },
          {
            first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
            sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
          },
        ],
        reviewed: true,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.INTRO);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/poem", {
        intro: "testing3",
        // "poet": "b7aeb1cd-7289-4547-9e22-c78188d84abf",
        verses: [
          {
            first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
            sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
          },
          {
            first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
            sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
          },
        ],
        reviewed: true,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.POET);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/poem", {
        intro: "testing4",
        poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.VERSES);
          return;
        }
        throw error;
      });
  });
});

describe("PUT /poem/:id", () => {
  let poemId: string;
  before(async () => {
    const data = {
      intro: "testing6",
      poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    };
    const req = await baseHttp.post("poem", data);
    poemId = req.data.id;
  });

  it("updates poem data successfuly with valid data", async () => {
    const req = await baseHttp.put(`poem/${poemId}`, { intro: "testing" });
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp.put(`poem/${poemId}`, { intro: 1221 }).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.INTRO);
        return;
      }
      throw error;
    });

    await baseHttp.put(`poem/${poemId}`, { poet: 1221 }).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.POET);
        return;
      }
      throw error;
    });

    await baseHttp
      .put(`poem/${poemId}`, { verses: { first: "safsasf", sec: "stsrsar" } })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.VERSES);
          return;
        }
        throw error;
      });
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = poemId.replace(poemId[5], "a");
      await baseHttp.put(`poem/${corruptedId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(
          error.response!.status,
          HttpStatusCode.NOT_ACCEPTABLE,
        );
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_VALID);
        return;
      }
      throw error;
    }
  });

  it("gets 400 with wrong :id format", async () => {
    try {
      await baseHttp.put(`poem/22`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    }
  });

  after(() => {
    baseHttp.delete(`/poem/${poemId}`);
  });
});

describe("DELETE /poet/:id", () => {
  let poemId: string;
  before(async () => {
    const data = {
      intro: "testing89",
      poet: "b7aeb1cd-7289-4547-9e22-c78188d84abf",
      verses: [
        {
          first: "فهوَ أمواجُ ظلامٍ .. لا تَرَى",
          sec: "لا تُبَالي .. لا تَعِي .. لا تَحْتَمي",
        },
        {
          first: "زهرةٌ حَنَّتْ, فباحت؛ فذوت",
          sec: "أذْبَلَتها نَفْحةٌ لم تُكْتَمِ",
        },
      ],
      reviewed: true,
    };
    const req = await baseHttp.post("poem", data);
    poemId = req.data.id;
  });

  it("Delete poem/:id successfully", async () => {
    const req = await baseHttp.delete(`/poem/${poemId}`);
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns 406 with nonExisting id", async () => {
    const corruptedId = poemId.replace(poemId[5], "a");
    await baseHttp.delete(`poem/${corruptedId}`).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.NOT_FOUND);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    });
  });

  it("returns 404 with nonExisting id", async () => {
    await baseHttp.delete(`poem/22`).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    });
  });
});
