// // registry.ts
// export const reducersRegistry: Record<string, any> = {};
// export const sagasRegistry: any[] = [];
// export const entitiesRegistry: string[] = []; // список усіх сутностей

// export function Entity(config: { name: string }) {
//   return function (target: any) {
//     // створюємо екземпляр сутності
//     const instance = new target();

//     // реєструємо reducer
//     reducersRegistry[config.name] = instance.reducer;

//     // реєструємо saga‑watcher
//     sagasRegistry.push(instance);

//     // додаємо імʼя сутності у список
//     entitiesRegistry.push(config.name);
//   };
// }
