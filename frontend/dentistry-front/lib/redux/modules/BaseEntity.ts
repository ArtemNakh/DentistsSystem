// import { toast } from "react-toastify";
// Твій клас BaseEntity — це універсальний шар для роботи з API + Redux:
// Виконує запити до бекенду (RequestToDB).
// Обгортає їх у Redux‑Saga (xFetch, actionRequest).
// Нормалізує дані (SaveReduxData).
// Диспатчить у Redux (ActionRedux).
// Має готові методи для CRUD (xRead, xSave).
import { HTTPMethod } from "http-method-enum";
import i18n from "i18next";
import { call, put } from "redux-saga/effects";
import ClientContextDI from "@/lib/di/ContextDi";
import { normalize, schema } from "normalizr";

import { ClientEntity } from "./Clients/ClientEntity";
import { AppointmentEntity } from "./Appointments/Appointment.Entity";
import { PaymentEntity } from "./Payments/Payments.Entity";
import { SpecialtyEntity } from "./Specialties/Entities/Specialties/Specialties.Entity";
import { DentistryEntity } from "./Dentistries/Dentistry.Entity";
import { WorkerEntity } from "./Workers/Workers.Entity";
import { AuthEntity } from "./AuthUser/AuthUser.Entity";
import { AppointmentActionsActionSaga } from "./AppointmentsActions/AppointmentActions.Entity";
import { OperationListEntity } from "./OperationList/OperationList.Entity";
import { FindingWorkerEntity } from "./FindingWorkers/FindingWorkerEntity";
import { ShiftsWorkerAction } from "./WorkerShifts/actions/GetShiftsToWorker/GetShiftsToWorker";
import { WorkerShiftsEntity } from "./WorkerShifts/WorkerShifts.Entity";
import { WorkerStatsEntity } from "./ADMINS/Stats/WorkerStats/WorkerStats.entity";
import { WorkerWeekendEntity } from "./ADMINS/Stats/WeekendStats/actions/WeekendStats.entity";
import { FindingSpecialtyEntity } from "./Specialties/Entities/FindedSpecialties/FindedSpecialties.Entity";

// Це буде базовий endpoint для всіх запитів.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Enum для імен сутностей у Redux.
// Використовується як ключ у редʼюсерах.
export const enum EntitiesRedux {
  Clients = "clients",
  Dentistries = "dentistries",
  Workers = "workers",
  Specialties = "specialties",
  Appointments = "appointments",
  Payments = "payments",
  Auth = "auth",
  AppointmentActions = "appointmentActions",
  OperationList = "operationList",
  FindingWorkers = "findingWorkers",
  WorkerShifts = "workerShifts",
  WorkerStats = "workerStats",
  WorkersWeekend = "workersWeekend",
  FindingSpecialties = "findingSpecialties",
}

// Entities — тип для сутностей
export type Entities =
  | ClientEntity
  | AppointmentEntity
  | DentistryEntity
  | WorkerEntity
  | PaymentEntity
  | SpecialtyEntity
  | AppointmentActionsActionSaga
  | OperationListEntity
  | AuthEntity
  | FindingWorkerEntity
  | WorkerShiftsEntity
  | WorkerStatsEntity
  | WorkerWeekendEntity
  | FindingSpecialtyEntity;

// IQueryResult<T> — тип відповіді від API: масив даних + повідомлення.
interface IQueryResult<T> {
  data: T[];
  message: {
    code: string;
    text: string;
  };
}

// Це базовий клас для всіх ентіті.
// Він успадковує ClientContextDI (твій DI‑контекст).
export default class BaseEntity extends ClientContextDI {
  // Викликає super(ctx) для DI.
  // Створює normalizr‑схему для цієї ентіті.
  // Зберігає її у this.schema.
  constructor(ctx: any, entityName: string, definition?: any) {
    super(ctx);

    this.schema = this.buildSchema(entityName, definition);
  }
  private schema;

  /**
   * Рекурсивно створює normalizr-схему для Entity.
   * @param entityName - Назва поточної ентіті.
   * @param definition - Визначення структури ентіті.
   */
  //   Створює normalizr‑схему для сутності.
  // Використовується для нормалізації даних перед збереженням у Redux.
  buildSchema(
    entityName: string,
    definition: Record<string, any>,
  ): schema.Entity {
    const schemaDefinition = definition ?? {};

    const entity = new schema.Entity(entityName, schemaDefinition);

    return entity;
  }

  /**Запит до бази даних та отримання результат */
  //   Виконує HTTP‑запит до API.
  // Якщо метод — POST/PUT/PATCH, додає body.
  // Якщо відповідь не ok, кидає помилку з кодом.
  // Повертає JSON‑результат.
  private async RequestToDB(
    endpoint: string,
    method: HTTPMethod,
    data?: any,
  ): Promise<any> {
    const methodsCheck = [HTTPMethod.PUT, HTTPMethod.POST, HTTPMethod.PATCH];

    const res = await fetch(`${apiUrl}${endpoint}`, {
      method,
      credentials: "include",
      ...(methodsCheck.includes(method) &&
        data !== undefined && {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
    });

    let result = null;
    try {
      result = await res.json();
    } catch {
      result = null; // якщо тіло пусте
    }

    console.log(
      "request api:",
      `${apiUrl}${endpoint}`,
      "// result before transform:",
      res,
      " // result after transform:",
      result,
    );
    if (!res.ok) {
      console.log("Error request");
      throw Object.assign(new Error(result.message), {
        code: result.code,
      });
    }
    return result;
  }

  /**обробка та показ(toast) результатів запиту */
  //   Використовує Redux‑Saga call для асинхронного запиту.
  // Повертає result.data.
  // Логіку з toast ти закоментував.
  private *xFetch(
    endpoint: string,
    method: HTTPMethod = HTTPMethod.GET,
    data?: any,
  ) {
    try {
      const result = (yield call(
        this.RequestToDB.bind(this),
        endpoint,
        method,
        data,
      )) as IQueryResult<any>;

      //   if (result.message.code === CodePurpose.toast)
      //     toast.success(i18n.t(result.message.text));

      return result;
    } catch (error: any) {
      console.log("error xFetch", error);

      //   if (error.code === CodePurpose.toast) toast.error(i18n.t(error.message));
    }
  }

  /**
   * actionRequest отримання даних та зберігання даних у reduix(із нормалізацією)
   */
  //   Викликає xFetch.
  // Потім передає результат у Redux через ActionRedux.
  private *actionRequest(
    endpoint: string,
    typeAction?: string,
    data?: any,
    method: HTTPMethod = HTTPMethod.GET,
  ): Generator<any, void, unknown> {
    const nonNormData = yield this.xFetch(endpoint, method, data);

    yield this.ActionRedux(nonNormData, typeAction);
    // yield this.SaveReduxData(nonNormData, typeAction);
  }

  /**
   * Нормалізує отримані дані та (за потреби) відправляє їх до Redux за допомогою dispatch'у.
   *
   * @param nonNormData - необроблені дані (обʼєкт або масив), які потрібно нормалізувати
   * @param typeAction - тип Redux-дії (наприклад: "GET", "POST"), який редюсер використовує для оновлення стану
   *
   * @yields - результат dispatch'у через yield put(...), що оновлює стан Redux
   **/
  // Використовує normalizr для нормалізації даних.
  // Повертає Redux‑action з type і payload.
  public SaveReduxData(nonNormData: any, typeAction: any): any {
    if (nonNormData && typeAction) {
      const normalizedData = Array.isArray(nonNormData)
        ? normalize(nonNormData, [this.schema])
        : normalize(nonNormData, this.schema);

      return {
        type: typeAction,
        payload: normalizedData,
      };
    }
  }

  /**
   * нормалізація даних та зберігання їх у redux
   * @param nonNormData
   * @param typeAction
   */
  //   Викликає SaveReduxData.
  // Диспатчить action у Redux через put.
  public *ActionRedux(nonNormData: any, typeAction: any) {
    const action = this.SaveReduxData(nonNormData, typeAction);
    yield put(action);
  }

  /**
   * Викликає запит до API або бекенду для читання даних.
   * Може використовувати GET, POST або інші HTTP методи.
   *
   * @param endpoint - шлях до API (наприклад "/api/videos")
   * @param typeAction - тип Redux-дії, яка буде dispatch'итись (наприклад "GET" або "POST")
   * @param data - необов’язкові дані, які передаються разом із запитом
   * @param method - HTTP-метод (за замовчуванням GET), може бути також POST, PUT, DELETE тощо
   *
   * @yields - результат з this.actionRequest(...) — обгортка для виконання запиту
   */
  //   xRead — для читання (GET).
  // xSave — для збереження (POST/PUT/PATCH).
  // Обидва викликають actionRequest, яка робить запит і диспатчить результат у Redux.
  public *xRead(
    endpoint: string,
    typeAction: string,
    data?: any,
    method: HTTPMethod = HTTPMethod.GET,
  ) {
    yield this.actionRequest(endpoint, typeAction, data, method);
  }

  /**
   * Виконує запит до API для збереження даних (наприклад, створення або оновлення).
   * В основному використовує HTTP POST, але підтримує й інші методи.
   * Внутрішньо викликає this.actionRequest, яка обробляє запит та зберігає результат в Redux.
   *
   * @param endpoint - шлях до API, за яким потрібно надіслати дані (наприклад "/api/videos")
   * @param data - обʼєкт із даними, які потрібно надіслати на сервер
   * @param typeAction - необовʼязковий тип Redux-диспатчу (наприклад "POST", "UPDATE"), який визначає, як зберігати дані
   * @param method - HTTP-метод, який буде використано (за замовчуванням POST, але може бути PUT, DELETE, PATCH)
   *
   * @yields - результат виконання actionRequest(), який обробляє логіку збереження та dispatch'у
   */
  public *xSave(
    endpoint: string,
    data: any,
    typeAction?: string,
    method: HTTPMethod = HTTPMethod.POST,
  ) {
    yield this.actionRequest(endpoint, typeAction, data, method);
  }

  // public *xDelete(endpoint: string, typeAction?: string, data?: any) {
  //   yield this.actionRequest(endpoint, typeAction, data, HTTPMethod.DELETE);
  // }
  public *xDelete(endpoint: string, id: number, typeAction?: string) {
    yield this.xFetch(endpoint, HTTPMethod.DELETE);
    if (typeAction) {
      yield put({ type: typeAction, payload: { ids: [id] } });
    }
  }
  /**
   * Виконує PUT‑запит для оновлення даних.
   * Використовується для редагування існуючих сутностей.
   *
   * @param endpoint - шлях до API (наприклад "/api/workers/1")
   * @param data - обʼєкт із даними для оновлення
   * @param typeAction - тип Redux‑дії (наприклад "UPDATE"), який редюсер використовує для оновлення стану
   *
   * @yields - результат виконання actionRequest(), який обробляє логіку запиту та dispatch'у
   */
  public *xUpdate(endpoint: string, data: any, typeAction?: string) {
    yield this.actionRequest(endpoint, typeAction, data, HTTPMethod.PUT);
  }
}
