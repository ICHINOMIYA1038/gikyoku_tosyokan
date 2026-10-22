// next.config.js の webpack 設定で、CSV は文字列として import される
declare module "*.csv" {
  const content: string;
  export default content;
}
