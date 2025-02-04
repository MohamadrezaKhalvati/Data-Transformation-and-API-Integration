// import { Path } from 'nestjs-i18n/dist/types';
// import { ValidationArguments } from 'class-validator';
// import { I18nContext } from 'nestjs-i18n';

// export function i18nValidationMessage<K = Record<string, unknown>>(
//   key: Path<K>,
//   args?: any,
// ): (a: ValidationArguments) => string {
//   return (a) => {
//     const { constraints } = a;

//     args = {
//       property: I18nContext.current().translate(`properties.${a.property}`, {
//         defaultValue: a.property,
//       }),
//     };
//     let { value } = a;
//     if (typeof value === 'string') {
//       value = value.replace(/\|/g, '');
//     }
//     return `${key}|${JSON.stringify(
//       Object.assign({ value, constraints }, args),
//     )}`;
//   };
// }
