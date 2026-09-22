/**
 * DEVELOPER THEME CONFIGURATION GUIDE
 * 
 * Theme changes are now strictly developer-controlled via CSS variables.
 * End-users cannot change themes from the UI.
 * 
 * To change the brand or accent color of the entire application, edit the
 * `:root` variables in `src/app/globals.css`:
 * 
 * :root {
 *   --theme-primary: #d84e55;         // Main brand primary color
 *   --theme-primary-hover: #b9373e;   // Hover & active states
 *   --theme-primary-light: #fff1f2;   // Light background tints, badges, chips
 *   --theme-primary-border: #fecdd3;  // Border accents
 *   --theme-primary-ring: rgba(216, 78, 85, 0.25); // Focus ring
 * }
 */

export const THEME_CONFIG = {
  primary: '#d84e55',
  hover: '#b9373e',
  light: '#fff1f2',
  border: '#fecdd3',
  ring: 'rgba(216, 78, 85, 0.25)',
} as const;
