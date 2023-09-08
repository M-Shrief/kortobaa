import { assert } from "chai";
import { describe, it } from "mocha";
// Utils
import { baseHttp, withAuthHttp } from "../axios";
import HttpStatusCode from "../../utils/httpStatusCode";
// Types
import { AxiosError } from "axios";
import { ERROR_MSG, Partner } from "../../components/partner/partner.entity";

const signupData = {
  name: "E2E Test",
  phone: "01235554568",
  password: "P@ssword1",
};

const loginData = {
  phone: "01235554567",
  password: "P@ssword1",
};

describe("GET /partner/:id", () => {
  let partnerId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("partner/login", loginData);
    partnerId = req.data.partner.id;
    token = req.data.accessToken;
  });
  it("get Partner info when authorized", async () => {
    const req = await withAuthHttp(token).get(`partner/${partnerId}`);

    assert.equal(req.status, HttpStatusCode.OK);

    assert.isString(req.data.id);
    assert.isString(req.data.name);
    assert.isString(req.data.phone);
  });

  it("responds with not authorized error when get Partner info with out authorization", async () => {
    await baseHttp.get(`partner/${partnerId}`).catch((error) => {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.UNAUTHORIZED);
        assert.equal(
          error.response!.data.message,
          "Unautorized for this request",
        );
        return;
      }
      throw error;
    });

    await withAuthHttp("tettt1")
      .get(`partner/${partnerId}`)
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.UNAUTHORIZED);
          assert.equal(
            error.response!.data.message,
            "Unautorized for this request",
          );
          return;
        }
        throw error;
      });
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = partnerId.replace(partnerId[5], "a");
      await withAuthHttp(token).get(`partner/${corruptedId}`);
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
      await withAuthHttp(token).get(`partner/22`);
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

describe("POST /partner/login", () => {
  it("It login with correct data", async () => {
    const req = await baseHttp.post("/partner/login", loginData);

    assert.equal(req.status, HttpStatusCode.ACCEPTED);

    assert.isTrue(req.data.success);

    assert.containsAllKeys(req.data.partner, ["id", "name", "phone"]);

    assert.isString(req.data.accessToken);
  });

  it("Refuse login with incorrect data", async () => {
    try {
      const req = await baseHttp.post("/partner/login", {
        phone: "01235554227",
        password: "P@ssword1",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        assert.equal(error.response!.status, HttpStatusCode.NOT_ACCEPTABLE);
        assert.equal(error.response!.data.message, ERROR_MSG.NOT_VALID);
        return;
      }
      throw error;
    }
  });

  it("return the correct error message with invalid data", async () => {
    await baseHttp
      .post("/partner/login", { phone: "01235554227" })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PASSWORD);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/partner/login", { password: "P@ssword1" })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PHONE);
          return;
        }
        throw error;
      });
  });
});

describe("POST /partner/signup", () => {
  it("partner signup successfully with correct data and it return the accessToken", async () => {
    const req = await baseHttp.post("partner/signup", signupData);

    assert.equal(req.status, HttpStatusCode.CREATED);

    assert.isTrue(req.data.Success);

    assert.containsAllKeys(req.data.partner, ["id", "name", "phone"]);

    assert.isString(req.data.accessToken);

    await withAuthHttp(req.data.accessToken).delete(
      `partner/${req.data.partner.id}`,
    );
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp
      .post("/partner/signup", {
        // "name": "E2E Test",
        phone: "01235554467",
        password: "P@ssword1",
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
      .post("/partner/signup", {
        name: "E2E Test",
        // "phone": "01235554467",
        password: "P@ssword1",
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PHONE);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/partner/signup", {
        name: "E2E Test",
        phone: "01235554567",
        // password: ""
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PASSWORD);
          return;
        }
        throw error;
      });
  });
});

describe("PUT /partner/:id", () => {
  let partnerId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("partner/signup", signupData);
    partnerId = req.data.partner.id;
    token = req.data.accessToken;
  });

  after(() => withAuthHttp(token).delete(`partner/${partnerId}`));

  it("It updates partner data successfully with valid data", async () => {
    const req = await withAuthHttp(token).put(`partner/${partnerId}`, {
      name: "E2E Put Test",
    });
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns the correct error message with invalid data", async () => {
    await withAuthHttp(token)
      .put(`partner/${partnerId}`, { name: 1221 })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.NAME);
          return;
        }
        throw error;
      });

    await withAuthHttp(token)
      .put(`partner/${partnerId}`, { phone: 12412 })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PHONE);
          return;
        }
        throw error;
      });

    await withAuthHttp(token)
      .put(`partner/${partnerId}`, { password: 1221 })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PASSWORD);
          return;
        }
        throw error;
      });
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = partnerId.replace(partnerId[5], "a");
      await withAuthHttp(token).put(`partner/${corruptedId}`);
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
      await withAuthHttp(token).put(`partner/22`);
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

describe("DELETE /partner/:id", () => {
  let partnerId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("partner/signup", signupData);
    partnerId = req.data.partner.id;
    token = req.data.accessToken;
  });

  it("Delete partner/:id successfully", async () => {
    const req = await withAuthHttp(token).delete(`/partner/${partnerId}`);
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = partnerId.replace(partnerId[5], "a");
      await withAuthHttp(token).delete(`partner/${corruptedId}`);
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
      await withAuthHttp(token).delete(`partner/22`);
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
