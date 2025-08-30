import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing: boolean = false // ✨ ۱. پیش‌فرض به false تغییر کرد
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // ✨ ۲. شرط جدید برای جلوگیری از بستن ناخواسته
        // اگر روی دکمه‌ای کلیک شد که خودش یک مودال دیگر را باز می‌کند، کاری نکن
        const targetElement = e.target as HTMLElement;
        if (targetElement.closest("[data-no-outside-click]")) return;

        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return ref;
}
