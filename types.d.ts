declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
declare module '*module.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}
