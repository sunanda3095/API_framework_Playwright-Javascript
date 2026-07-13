import config from "../config/config.json";
import { expect } from "@playwright/test";

export class LoginPage {

    constructor(request) {
        this.request = request;
    }

    async login(loginData) {

    const response = await this.request.post(
        `${config.baseURL}/authentication`,
        {
            headers: {
                "Content-Type": "application/json"
            },
            data: loginData
        }
    );

    //expect(response.status()).toBe(200);

    const responseBody = await response.json();

    return {
        response,
        responseBody
    };
}

     async getToken(loginData) {


        const result = await this.login(loginData);

      return result.responseBody.token;
    }


}

