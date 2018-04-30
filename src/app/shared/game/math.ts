export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function roughSizeOfObject(object) {

  const objectList = [];
  const stack = [ object ];
  let bytes = 0;

  while ( stack.length ) {
      const value = stack.pop();

      if ( typeof value === 'boolean' ) {
          bytes += 4;
      } else if ( typeof value === 'string' ) {
          bytes += value.length * 2;
      } else if ( typeof value === 'number' ) {
          bytes += 8;
      } else if
      (
          typeof value === 'object'
          && objectList.indexOf( value ) === -1
      ) {
          objectList.push( value );

          // tslint:disable-next-line:forin
          for ( const i in value ) {
              stack.push( value[ i ] );
          }
      }
  }
  return Math.floor(bytes / 1024);
}
