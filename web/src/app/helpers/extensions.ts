export class Extensions{
    static takeLastInURL(url:string) : string {
    const urlArray = url?.split('/');
    if(!!urlArray){
      return urlArray[urlArray.length - 1];
    }
    return '';
    }
}
