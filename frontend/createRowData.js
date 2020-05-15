import faker from "faker";

function createFakeRow(index) {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email()
    };
}

export default function createRowData(count) {
    return [...Array(count).keys()].map(i => createFakeRow(i));
}