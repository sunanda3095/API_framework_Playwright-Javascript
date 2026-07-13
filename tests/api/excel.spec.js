import { test,expect } from "@playwright/test";
import { readExcel } from "../../API_framework/utils/excelReader.js";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage.js";
test("Read Login Excel", async ({request}) => {

                const data = readExcel(
                        "C:/Users/admin/APIplaywright/API_framework/testData/TestData.xlsx",
                        "login"
            );
            //console.log(data);
            const login = new LoginPage(request);
            for (const row of data) {

            if (row.Execute !== "Yes")
                continue;

            console.log(row);
            const requestBody = JSON.parse(row.RequestBody);
            const result = await login.login(requestBody);
                console.log(result.response.status());
                console.log(result.responseBody);
                
           expect(result.response.status()).toBe(Number(row.ExpectedStatus));

            expect(result.responseBody.detail).toBe(row.ExpectedMessage);

            
            console.log(requestBody);
        }
            

});