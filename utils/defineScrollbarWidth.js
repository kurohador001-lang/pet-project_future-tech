const defineScrollBarWidth = () => {
  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${window.innerWidth - document.documentElement.clientWidth}px`,
  );
};

export default defineScrollBarWidth;
