"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedClients = seedClients;
const faker_1 = require("@faker-js/faker");
const client_entity_1 = require("../../../src/clients/entities/client.entity");
const client_interface_1 = require("../../../src/clients/entities/client.interface");
async function seedClients(dataSource, NumbersClients = 100) {
    const repo = dataSource.getRepository(client_entity_1.Client);
    const clients = [];
    for (let i = 0; i < NumbersClients; i++) {
        const client = repo.create({
            name: faker_1.faker.person.firstName(),
            surname: faker_1.faker.person.lastName(),
            middle_name: faker_1.faker.person.middleName(),
            birthdate: faker_1.faker.date.birthdate({ min: 10, max: 80, mode: 'age' }),
            blood_resus: faker_1.faker.helpers.arrayElement([
                client_interface_1.BloodSign.plus,
                client_interface_1.BloodSign.minus,
            ]),
            blood_group: faker_1.faker.helpers.arrayElement([1, 2, 3, 4]),
            phone: faker_1.faker.phone.number('###-###-####'),
            allergic_diseases: faker_1.faker.lorem.words(3),
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password({ length: 10 }),
            isVerified: false,
        });
        clients.push(client);
    }
    await repo.save(clients);
    console.log(`✅ Згенеровано ${NumbersClients} клієнтів`);
}
//# sourceMappingURL=4_seed-filling-clients.js.map