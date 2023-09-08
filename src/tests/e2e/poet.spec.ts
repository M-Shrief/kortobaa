import { assert } from "chai";
import { describe, it } from "mocha";
import { AxiosError } from "axios";
// Utils
import { baseHttp } from "../axios";
import HttpStatusCode from "../../utils/httpStatusCode";
// Types
import { Poet, ERROR_MSG } from "../../components/poet/poet.entity";

describe("GET /poets", async () => {
  it("Responds with the right JSON body", async () => {
    const req = await baseHttp.get("poets");

    assert.strictEqual(req.status, HttpStatusCode.OK);
    const poets: Poet[] = req.data;

    assert.isArray(poets);
    assert.isDefined(poets[0].id);
    assert.isDefined(poets[0].name);
    assert.isDefined(poets[0].time_period);
  });
});

describe("GET /poet/:id", async () => {
  let poetId: string;
  before(async () => {
    const req = await baseHttp.get("poets");
    poetId = req.data[0].id;
  });
  it("Responds with the right JSON body", async () => {
    const req = await baseHttp.get(`poet/${poetId}`);

    assert.strictEqual(req.status, HttpStatusCode.OK);
    const poet: Poet = req.data;

    assert.isDefined(poet.id);
    assert.isDefined(poet.name);
    assert.isDefined(poet.time_period);

    assert.isArray(poet.poems);
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = poetId.replace(poetId[2], "a");
      await baseHttp.get(`poet/${corruptedId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(error.response!.status, HttpStatusCode.NOT_FOUND);

        assert.isString(error.response!.data.message);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    }
  });

  it("gets 400 with wrong :id format", async () => {
    try {
      await baseHttp.get(`poet/22`);
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.strictEqual(error.response!.status, HttpStatusCode.BAD_REQUEST);

        assert.isString(error.response!.data.message);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    }
  });
});

describe("POST /poets", () => {
  const data = [
    {
      name: "Testing",
      time_period: "عباسي",
      bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
      reviewed: true,
    },
    {
      name: "محمود شاكر (أبو فهر)",
      time_period: "متأخر وحديث",
      bio: "رزق عقل الشافعي، وعبقرية الخليل، ولسان ابن حزم، وشجاعة ابن تيمية، وبهذه الأمور الأربعة مجتمعة حصَّل من المعارف والعلوم العربية ما لم يحصله أحد من أبناء جيله، ثم خاض تلك المعارك الحامية: فحارب الدعوة إلى العامية، وحارب الدعوة إلى كتابة اللغة العربية بالحروف اللاتينية، وحارب الدعوة إلى هلهلة اللغة العربية، والعبث بها بحجة التطور اللغوي، ثم حارب من قبل ومن بعد: الخرافات والبدع والشعوذة التي ابتعدت بالمسلمين عن منهج السلف، في صحة العقيدة، وفي تجريد الإيمان من شوائب الشرك الظاهر والباطن",
      reviewed: true,
    },
    {
      name: 21,
      time_period: 421,
      bio: "رزق عقل الشافعي، وعبقرية الخليل، ولسان ابن حزم، وشجاعة ابن تيمية، وبهذه الأمور الأربعة مجتمعة حصَّل من المعارف والعلوم العربية ما لم يحصله أحد من أبناء جيله، ثم خاض تلك المعارك الحامية: فحارب الدعوة إلى العامية، وحارب الدعوة إلى كتابة اللغة العربية بالحروف اللاتينية، وحارب الدعوة إلى هلهلة اللغة العربية، والعبث بها بحجة التطور اللغوي، ثم حارب من قبل ومن بعد: الخرافات والبدع والشعوذة التي ابتعدت بالمسلمين عن منهج السلف، في صحة العقيدة، وفي تجريد الإيمان من شوائب الشرك الظاهر والباطن",
      reviewed: true,
    },
  ];
  const testPoetsId: string[] = [];
  afterEach(() => {
    testPoetsId.forEach(async (id) => {
      await baseHttp.delete(`poet/${id}`);
    });
  });
  it("it saves valid entries correctly, and returns valid & non-valid entries", async () => {
    const req = await baseHttp.post("/poets", data);
    const poetsIds = req.data.newPoets.map((poet: Poet) => poet.id);
    testPoetsId.push(...poetsIds);

    assert.strictEqual(req.status, HttpStatusCode.CREATED);

    assert.isNotEmpty(req.data.newPoets);
    assert.containsAllKeys(req.data.newPoets[0], data[0]);

    assert.isNotEmpty(req.data.nonValidPoets);
    assert.containsAllKeys(req.data.nonValidPoets[0], data[2]);
  });
});

describe("POST /poet", () => {
  const data = {
    name: "Testing",
    time_period: "عباسي",
    bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
    reviewed: true,
  } as Poet;

  it("it post valid data correctly", async () => {
    const req = await baseHttp.post("/poet", data);

    assert.containsAllKeys(req.data, data);

    await baseHttp.delete(`poet/${req.data.id}`);
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp
      .post("/poet", {
        // "name": 'Testing',
        time_period: "عباسي",
        bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
        reviewed: true,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.NAME);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/poet", {
        name: "Testing",
        // "time_period": "عباسي",
        bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
        reviewed: true,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.TIME_PERIOD);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/poet", {
        name: "Testing",
        time_period: "عباسي",
        // "bio": "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
        reviewed: true,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.BIO);
          return;
        }
        throw error;
      });
  });
});

describe("PUT /poet/:id", () => {
  const data = {
    name: "ring ring",
    time_period: "عباسي",
    bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
    reviewed: true,
  } as Poet;
  let poetId: string;
  before(async () => {
    const req = await baseHttp.post("poet", data);
    poetId = req.data.id;
  });

  it("updates poet data successfuly with valid data", async () => {
    const req = await baseHttp.put(`poet/${poetId}`, { name: "ring" });
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp
      .put(`poet/${poetId}`, {
        name: 124,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.NAME);
          return;
        }
        throw error;
      });

    await baseHttp
      .put(`poet/${poetId}`, {
        time_period: 21,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.TIME_PERIOD);
          return;
        }
        throw error;
      });

    await baseHttp
      .put(`poet/${poetId}`, {
        bio: 122,
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.BIO);
          return;
        }
        throw error;
      });
  });

  it("returns 406 with nonExisting id", async () => {
    const corruptedId = poetId.replace(poetId[2], "a");
    await baseHttp.put(`poet/${corruptedId}`, data).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.NOT_ACCEPTABLE);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_VALID);
        return;
      }
      throw error;
    });
  });

  it("returns 404 with nonExisting id", async () => {
    await baseHttp.put(`poet/22`, data).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    });
  });

  after(async () => {
    await baseHttp.delete(`poet/${poetId}`);
  });
});

describe("DELETE /poet/:id", () => {
  const data = {
    name: "Testing",
    time_period: "عباسي",
    bio: "أبو الحسن علي بن محمد بن فهد Testing. من كبار شعراء العرب، نعته الذهبي بشاعر وقته. مولده ومنشؤه في اليمن، وأصله من أهل مكة، كان يكتم نسبه، فينتسب مرة للعلوية وأخرى لبني أمية. وانتحل مذهب الاعتزال",
    reviewed: true,
  } as Poet;
  let poetId: string;
  before(async () => {
    const req = await baseHttp.post("poet", data);
    poetId = req.data.id;
  });
  it("Delete poet/:id successfully", async () => {
    const req = await baseHttp.delete(`/poet/${poetId}`);
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns 406 with nonExisting id", async () => {
    const corruptedId = poetId.replace(poetId[2], "a");
    await baseHttp.delete(`poet/${corruptedId}`).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.NOT_FOUND);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    });
  });

  it("returns 404 with nonExisting id", async () => {
    await baseHttp.delete(`poet/22`).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_FOUND);
        return;
      }
      throw error;
    });
  });
});
