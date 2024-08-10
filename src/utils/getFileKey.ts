export function getFileKey(url: string){
  const urls = url.split('/');
  const result = urls[urls.length - 1];
  return result
}