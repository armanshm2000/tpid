// This script runs before React hydrates to apply the saved theme.
// It should be included in <head> via next.config.js or layout.tsx.
export function getThemeInitScript(): string {
  return `
    (function() {
      try {
        var saved = localStorage.getItem('tpid-settings');
        if (saved) {
          var parsed = JSON.parse(saved);
          if (parsed.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (parsed.theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else if (parsed.theme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
          }
        }
      } catch(e) {}
    })();
  `;
}
