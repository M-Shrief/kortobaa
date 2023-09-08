import { assert } from "chai";
import { describe, it } from "mocha";
// Utils
import { baseHttp, withAuthHttp } from "../axios";
import HttpStatusCode from "../../utils/httpStatusCode";
// Types
import { AxiosError } from "axios";
import { ERROR_MSG, User } from "../../components/user/user.entity";

const signupData = {
  name: "E2E Test",
  phone: "01235554568",
  password: "P@ssword1",
};

const loginData = {
  phone: "01235554567",
  password: "P@ssword1",
};

describe("GET /user/:id", () => {
  let userId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("user/login", loginData);
    userId = req.data.user.id;
    token = req.data.accessToken;
  });
  it("get User info when authorized", async () => {
    const req = await withAuthHttp(token).get(`user/${userId}`);

    assert.equal(req.status, HttpStatusCode.OK);

    assert.isString(req.data.id);
    assert.isString(req.data.name);
    assert.isString(req.data.phone);
  });

  it("responds with not authorized error when get User info with out authorization", async () => {
    await baseHttp.get(`user/${userId}`).catch((error) => {
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
      .get(`user/${userId}`)
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
      const corruptedId = userId.replace(userId[5], "a");
      await withAuthHttp(token).get(`user/${corruptedId}`);
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
      await withAuthHttp(token).get(`user/22`);
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

describe("POST /user/login", () => {
  it("It login with correct data", async () => {
    const req = await baseHttp.post("/user/login", loginData);

    assert.equal(req.status, HttpStatusCode.ACCEPTED);

    assert.isTrue(req.data.success);

    assert.containsAllKeys(req.data.user, ["id", "name", "phone"]);

    assert.isString(req.data.accessToken);
  });

  it("Refuse login with incorrect data", async () => {
    try {
      const req = await baseHttp.post("/user/login", {
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
      .post("/user/login", { phone: "01235554227" })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PASSWORD);
          return;
        }
        throw error;
      });

    await baseHttp
      .post("/user/login", { password: "P@ssword1" })
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

describe("POST /user/signup", () => {
  it("user signup successfully with correct data and it return the accessToken", async () => {
    const req = await baseHttp.post("user/signup", signupData);

    assert.equal(req.status, HttpStatusCode.CREATED);

    assert.isTrue(req.data.Success);

    assert.containsAllKeys(req.data.user, ["id", "name", "phone"]);

    assert.isString(req.data.accessToken);

    await withAuthHttp(req.data.accessToken).delete(
      `user/${req.data.user.id}`,
    );
  });

  it("returns the correct error message with invalid data", async () => {
    await baseHttp
      .post("/user/signup", {
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
      .post("/user/signup", {
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
      .post("/user/signup", {
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

describe("PUT /user/:id", () => {
  let userId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("user/signup", signupData);
    userId = req.data.user.id;
    token = req.data.accessToken;
  });

  after(() => withAuthHttp(token).delete(`user/${userId}`));

  it("It updates user data successfully with valid data", async () => {
    const req = await withAuthHttp(token).put(`user/${userId}`, {
      name: "E2E Put Test",
    });
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("returns the correct error message with invalid data", async () => {
    await withAuthHttp(token)
      .put(`user/${userId}`, { name: 1221 })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.NAME);
          return;
        }
        throw error;
      });

    await withAuthHttp(token)
      .put(`user/${userId}`, { phone: 12412 })
      .catch((error) => {
        if (error instanceof AxiosError) {
          assert.equal(error.response!.status, HttpStatusCode.BAD_REQUEST);
          assert.equal(error.response!.data.message, ERROR_MSG.PHONE);
          return;
        }
        throw error;
      });

    await withAuthHttp(token)
      .put(`user/${userId}`, { password: 1221 })
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
      const corruptedId = userId.replace(userId[5], "a");
      await withAuthHttp(token).put(`user/${corruptedId}`);
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
      await withAuthHttp(token).put(`user/22`);
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

describe("DELETE /user/:id", () => {
  let userId: string;
  let token: string;
  before(async () => {
    const req = await baseHttp.post("user/signup", signupData);
    userId = req.data.user.id;
    token = req.data.accessToken;
  });

  it("Delete user/:id successfully", async () => {
    const req = await withAuthHttp(token).delete(`/user/${userId}`);
    assert.equal(req.status, HttpStatusCode.ACCEPTED);
  });

  it("gets 404 with nonExisting UUID", async () => {
    try {
      const corruptedId = userId.replace(userId[5], "a");
      await withAuthHttp(token).delete(`user/${corruptedId}`);
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
      await withAuthHttp(token).delete(`user/22`);
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
