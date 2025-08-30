export function findObjectValue(obj: Record<string, any>, prop: string, defaultValue?: any) {
  if (typeof prop == "undefined") return undefined;
  if (typeof defaultValue == "undefined") defaultValue = undefined;
  const propArr = prop?.split(".");

  for (let i = 0; i < propArr.length; i++) {
    if (typeof obj[propArr[i]] == "undefined") return defaultValue;
    obj = obj[propArr[i]];
  }

  return obj;
}
