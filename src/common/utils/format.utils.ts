import { BASE_DATE_FORMAT } from '../../constants';
import { format, isValid } from 'date-fns';

export function separateNumber(value: number, separator: string = ' '): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export const camalize = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            .replace(/^[A-Z]+(?=[a-z0-9])/, match => match.toLowerCase());
};

export const formatDate = (date: string, dateFormat: string = BASE_DATE_FORMAT): string => {
  if (!isValid(new Date(date))) return date;
  return format(new Date(date), dateFormat);
};

//clear object from empty values
export const clearObject = (obj: Record<string, any>): Record<string, any> => {
  const result: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const groupBy = (array: any[], keySelector: any) => {
  return array.reduce((result: any, element: any) => {
    const key = keySelector(element);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(element);
    return result;
  }, {});
}