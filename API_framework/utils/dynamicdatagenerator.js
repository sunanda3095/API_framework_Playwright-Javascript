import { faker } from "@faker-js/faker";

const generatedValues = {};

const generators = {
    "{{EMAIL}}": () => `emo${faker.internet.email()}`,
    "{{ID}}": () => `${faker.number.int({ min: 1000, max: 9999 })}emo`,
    "{{PERSONAL_EMAIL}}": () => `personal${Date.now()}@gmail.com`,
    "{{FIRST_NAME}}": () => faker.person.firstName(),
    "{{LAST_NAME}}": () => faker.person.lastName(),
    "{{PHONE}}": () => faker.phone.number(),
    "{{CITY}}": () => faker.location.city()
};

export function buildData(template) {

    const data = JSON.parse(JSON.stringify(template));

    replace(data);

    return data;
}

function replace(obj) {

    for (const key in obj) {

        if (typeof obj[key] === "object" && obj[key] !== null) {
            replace(obj[key]);
        }

        else if (generators[obj[key]]) {

            if (!generatedValues[obj[key]]) {
                generatedValues[obj[key]] = generators[obj[key]]();
            }

            obj[key] = generatedValues[obj[key]];
        }
    }
}

export function clearGeneratedValues() {
    Object.keys(generatedValues).forEach(key => delete generatedValues[key]);
}