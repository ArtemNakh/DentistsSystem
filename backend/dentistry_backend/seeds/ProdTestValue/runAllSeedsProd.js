"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../src/database/data-source"));
const _10_seed_filling_notifications_1 = require("./seeders/10_seed-filling-notifications");
const _11_seed_filling_payments_1 = require("./seeders/11_seed-filling-payments");
const _1_seed_filling_dental_clinics_1 = require("./seeders/1_seed-filling-dental-clinics");
const _2_seed_filling_specialties_1 = require("./seeders/2_seed-filling-specialties");
const _3_seed_filling_operation_list_1 = require("./seeders/3_seed-filling-operation-list");
const _4_seed_filling_clients_1 = require("./seeders/4_seed-filling-clients");
const _5_seed_filling_worker_1 = require("./seeders/5_seed-filling-worker");
const _6_seed_filling_license_1 = require("./seeders/6_seed-filling-license");
const _7_seed_filling_workers_shifts_1 = require("./seeders/7_seed-filling-workers-shifts");
const _8_seed_filling_appointments_1 = require("./seeders/8_seed-filling-appointments");
const _9_seed_filling_appointments_actions_1 = require("./seeders/9_seed-filling-appointments-actions");
async function runAllSeeds() {
    try {
        await data_source_1.default.initialize();
        await (0, _1_seed_filling_dental_clinics_1.seedDentistries)(data_source_1.default, 5);
        await (0, _2_seed_filling_specialties_1.seedSpecialties)(data_source_1.default, 50);
        await (0, _3_seed_filling_operation_list_1.seedOperationList)(data_source_1.default, 3, 15, 10, 1000);
        await (0, _4_seed_filling_clients_1.seedClients)(data_source_1.default, 50);
        await (0, _5_seed_filling_worker_1.seedWorkers)(data_source_1.default, 5, 30);
        await (0, _6_seed_filling_license_1.seedLicenses)(data_source_1.default, 2, 14);
        await (0, _7_seed_filling_workers_shifts_1.seedWorkerShifts)(data_source_1.default, 10, 50);
        await (0, _8_seed_filling_appointments_1.seedAppointments)(data_source_1.default, 1, 25, 20, 50);
        await (0, _9_seed_filling_appointments_actions_1.seedAppointmentActions)(data_source_1.default, 1, 10);
        await (0, _10_seed_filling_notifications_1.seedNotifications)(data_source_1.default);
        await (0, _11_seed_filling_payments_1.seedPayments)(data_source_1.default);
        console.log('✅ Усі сидери відпрацювали успішно');
        await data_source_1.default.destroy();
    }
    catch (error) {
        console.error('❌ Помилка при запуску сидів:', error);
        await data_source_1.default.destroy();
    }
}
runAllSeeds();
//# sourceMappingURL=runAllSeedsProd.js.map