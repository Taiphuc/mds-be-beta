export function chunkArray(array: any[], chunkLength: number = 50) {
  const pageCount = Math.ceil(array.length / chunkLength);
  const newArr: any[] = [];
  for (let i = 0; i < pageCount; i++) {
    newArr.push(array?.splice(0, chunkLength));
  }
  return newArr;
}
