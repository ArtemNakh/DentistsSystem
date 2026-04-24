export interface ISpecialty {
  id: number;
  name: string;
  description?: string;
}

export interface IWorker {
  id: number;
  name: string;
  surname?: string;
  middle_name?: string;
  phone?: string;
  specialty?: ISpecialty;
}

export interface IWorkerStats {
  id: string;          // збігається з worker.id
  worker: IWorker;     // вкладений об’єкт працівника
  stats: {
    total: number;       // загальна кількість
    schedule: number;    // заплановані
    completed: number;   // завершені
    waitPaid: number;    // очікують оплати
    cancelled: number;   // скасовані
  };
}
