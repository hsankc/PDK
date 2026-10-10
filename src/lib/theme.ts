// Sunucu (kök düzen) ve tarayıcı (tema düğmesi) birlikte kullandığı için "use client" dosyasında değil, burada durur.

export const THEME_KEY = "pdk-tema";

/** <head> içinde, sayfa çizilmeden önce çalışır: kayıtlı tercih yoksa cihazın temasını kullanır. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;
