import { faker } from "@faker-js/faker";
import { buildData } from "./dynamicdatagenerator.js";

const randomGenerators = {
    email: () => `emo${faker.internet.email()}`,
    personal_email: () => `personal${Date.now()}@gmail.com`,
    id: () => `${faker.number.int({ min: 1000, max: 9999 })}emo`,
    first_name: () => faker.person.firstName(),
    last_name: () => faker.person.lastName(),
    password: () => faker.internet.password(),
    mobile_number: () => faker.string.numeric(10),
    address: () => faker.location.streetAddress(),
    city: () => faker.location.city(),
    department: () => faker.commerce.department(),
    designation: () => faker.person.jobTitle(),
    salary: () => faker.number.int({ min: 20000, max: 100000 }).toString(),
    qualifications: () => "Degree",
    reporting_to: () => faker.internet.email()
};

export function buildRequest(template, overrides = {}) {

    const data = buildData(template);

    for (const [key, value] of Object.entries(overrides)) {

        if (value === "" || value === null || value === undefined) {
            continue;
        }

        if (value === "EMPTY") {
            delete data[key];
        }
        else if (value === "RANDOM" && randomGenerators[key]) {
            data[key] = randomGenerators[key]();
        }
        else {
            data[key] = value;
        }
    }

    return data;
}