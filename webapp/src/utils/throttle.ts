import { APIService } from "./apiService";
import { EmployeeInfo } from "./types";

export async function asyncForEach(
  array: any[],
  callback: {
    (batch: any): Promise<void>;
    (arg0: any, arg1: number, arg2: any[]): any;
  }
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
export function split(arr: any[], n: any) {
  var res: any[] = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
}
export const delayMS = (t = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(t);
    }, t);
  });
};

export const throttledFetchUserData = (
  items: string[],
  batchSize = 1,
  delay = 0,
  setStateMessage?: (message: string) => void
) => {
  setStateMessage && setStateMessage(`Fetching applicant details`);
  return new Promise<any[]>(async (resolve, reject) => {
    const output: any = [];
    const batches = split(items, batchSize);
    await asyncForEach(batches, async (batch: any) => {
      const promises = batch
        .map(
          APIService.getInstance().get<{
            employeeInfo: EmployeeInfo;
          }>
        )
        .map((p: Promise<any>) =>
          p.catch((res) => {
            return res;
          })
        );
      const results = await Promise.all(promises);

      output.push(...results);

      await delayMS(delay);
    });
    resolve(output);
  });
};
