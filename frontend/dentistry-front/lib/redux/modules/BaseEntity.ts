// import { toast } from "react-toastify";
// Твій клас BaseEntity — це універсальний шар для роботи з API + Redux:
// Виконує запити до бекенду (RequestToDB).
// Обгортає їх у Redux‑Saga (xFetch, actionRequest).
// Нормалізує дані (SaveReduxData).
// Диспатчить у Redux (ActionRedux).
// Має готові методи для CRUD (xRead, xSave).
import { HTTPMethod } from "http-method-enum";
import i18n from "i18next";
// import { CodePurpose } from "@/server/Exceptions/utils/CodePurpose";
import { call, put } from "redux-saga/effects";
// import ClientContextDI from "@/client/di/ClientContextDI";
import ClientContextDI from "@/lib/di/ContextDt";
import { normalize, schema } from "normalizr";
// import { VideoEntity } from "../Entities/VideoEntity";
import { ClientEntity } from "./clients/ClientEntity";
// import { ReviewEntity } from "../Entities/ReviewEntity";
// import { UserEntity } from "../Entities/UserEntity";
// import { AuthEntity } from "../Entities/AuthEntity";
// import { ActorEntity } from "../Entities/ActorEntity";
// import { ActorRoleEntity } from "../Entities/ActorRoleEntity";
// const {
//   publicRuntimeConfig: { NEXT_PUBLIC_API_URL },
// } = getConfig();

// Це буде базовий endpoint для всіх запитів.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Enum для імен сутностей у Redux.
// Використовується як ключ у редʼюсерах.
export const enum EntitiesRedux {
  //   Users = "users",
  //   Actors = "actors",
  //   Videos = "videos",
  //   Reviews = "reviews",
  //   ActorRole = "actorsRole",
  //   AuthUser = "authUser",
  Clients = "clients",
  Dentistries="dentistries",
  Workers='workers',
  Specialties="specialties"
}

// export type Entities =
//   | VideoEntity
//   | ReviewEntity
//   | UserEntity
//   | AuthEntity
//   | ActorEntity
//   | ActorRoleEntity;

// Entities — тип для сутностей
export type Entities = ClientEntity;

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
    console.log("request");

    const methodsCheck = [HTTPMethod.PUT, HTTPMethod.POST, HTTPMethod.PATCH];

    const res = await fetch(`${apiUrl}${endpoint}`, {
      method,
      ...(methodsCheck.includes(method) &&
        data !== undefined && {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
    });
    console.log("1", res);
    const result = await res.json();

    console.log("tes", result);
    if (!res.ok) {
      console.log("check")
      throw Object.assign(new Error(result.message), {
        code: result.code,
      });
    }
console.log('cor')
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
    console.log("xfetch");
    try {
      const result = (yield call(
        this.RequestToDB.bind(this),
        endpoint,
        method,
        data,
      )) as IQueryResult<any>;

      //   if (result.message.code === CodePurpose.toast)
      //     toast.success(i18n.t(result.message.text));

      console.log("resultdata", result);
      return result;
    } catch (error: any) {
      console.log("erras", error);

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
    console.log("NonNormalData", nonNormData);
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
    console.log("NonNormalData", nonNormData);
    const action = this.SaveReduxData(nonNormData, typeAction);
    console.log("Action", action);
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
    console.log("xread");
    yield this.actionRequest(endpoint, typeAction, data, method);
    console.log("xread end");
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
    console.log("xsave");
    yield this.actionRequest(endpoint, typeAction, data, method);
    console.log("xsave end");
  }
}
