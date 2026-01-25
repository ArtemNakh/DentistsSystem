
import { call, put } from "redux-saga/effects";


import { normalize, schema } from "normalizr";


const {
  publicRuntimeConfig: { BASE_URL },
} = getConfig();

export type Entities =;


interface IQueryResult<T> {
  data: T[];
  message: {
    code: string;
    text: string;
  };
}

export default class BaseEntity extends ClientContextDI {
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
  buildSchema(
    entityName: string,
    definition: Record<string, any>
  ): schema.Entity {
    const schemaDefinition = definition ?? {};

    const entity = new schema.Entity(entityName, schemaDefinition);

    return entity;
  }

  /**Запит до бази даних та отримання результат */
  private async RequestToDB(
    endpoint: string,
    method: HTTPMethod,
    data?: any
  ): Promise<any> {
    console.log("request");

    const methodsCheck = [HTTPMethod.PUT, HTTPMethod.POST, HTTPMethod.PATCH];

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      ...(methodsCheck.includes(method) &&
        data !== undefined && {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw Object.assign(new Error(result.message), {
        code: result.code,
      });
    }

    return result;
  }

  /**обробка та показ(toast) результатів запиту */
  private *xFetch(
    endpoint: string,
    method: HTTPMethod = HTTPMethod.GET,
    data?: any
  ) {
    console.log("xfetch");
    try {
      const result = (yield call(
        this.RequestToDB.bind(this),
        endpoint,
        method,
        data
      )) as IQueryResult<any>;

      if (result.message.code === CodePurpose.toast)
        toast.success(i18n.t(result.message.text));

      console.log("resultdata", result.data);
      return result.data;
    } catch (error: any) {
      console.log("erras", error);

      if (error.code === CodePurpose.toast) toast.error(i18n.t(error.message));
    }
  }

  /**
   * actionRequest отримання даних та зберігання даних у reduix(із нормалізацією)
   */
  private *actionRequest(
    endpoint: string,
    typeAction?: string,
    data?: any,
    method: HTTPMethod = HTTPMethod.GET
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
  public *xRead(
    endpoint: string,
    typeAction: string,
    data?: any,
    method: HTTPMethod = HTTPMethod.GET
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
    method: HTTPMethod = HTTPMethod.POST
  ) {
    console.log("xsave");
    yield this.actionRequest(endpoint, typeAction, data, method);
    console.log("xsave end");
  }
}