/* eslint-disable @typescript-eslint/naming-convention */
declare const GRAPHQL_HOST: string;
declare const STATIC_HOST: string;

declare module '*.scss' {
  const classes: {
    [name: string]: string;
  };
  export default classes;
}

declare module '*.png' {
  const image: string;
  export default image;
}

declare module '*.jpg' {
  const image: string;
  export default image;
}
