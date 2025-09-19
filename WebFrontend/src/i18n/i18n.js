/**
 * Minimal i18n context with English and Spanish strings.
 */
import React from 'react';

const translations = {
  en: {
    'nav.main': 'Main navigation',
    'nav.home': 'Home',
    'nav.map': 'Map',
    'nav.gallery': 'Gallery',
    'nav.upload': 'Upload',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.language': 'Language selector',
    'nav.toggle_theme': 'Toggle theme',
    'auth.login': 'Log in',
    'auth.logout': 'Log out',
    'auth.register': 'Register',
    'a11y.skip_to_content': 'Skip to content',
    'footer.copy': '© Travel Photography Guide',
    'errors.not_found': 'Page not found',
    'search.placeholder': 'Search locations...',
    'gallery.view_grid': 'Grid view',
    'gallery.view_list': 'List view',
    'upload.title': 'Upload Photo',
    'upload.select_file': 'Select photo file',
    'upload.location': 'Location',
    'upload.tags': 'Tags (comma-separated)',
    'upload.description': 'Description',
    'upload.submit': 'Upload',
    'photo.edit': 'Edit metadata',
    'photo.privacy': 'Privacy',
    'photo.public': 'Public',
    'photo.private': 'Private',
    'photo.save': 'Save',
    'photo.share': 'Share',
    'photo.like': 'Like',
    'photo.favorite': 'Favorite',
    'photo.comment.placeholder': 'Add a comment...',
    'photo.comment.submit': 'Comment',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.or': 'or',
    'auth.login_with': 'Log in with',
    'settings.title': 'Settings',
  },
  es: {
    'nav.main': 'Navegación principal',
    'nav.home': 'Inicio',
    'nav.map': 'Mapa',
    'nav.gallery': 'Galería',
    'nav.upload': 'Subir',
    'nav.profile': 'Perfil',
    'nav.settings': 'Ajustes',
    'nav.language': 'Selector de idioma',
    'nav.toggle_theme': 'Cambiar tema',
    'auth.login': 'Iniciar sesión',
    'auth.logout': 'Cerrar sesión',
    'auth.register': 'Registrarse',
    'a11y.skip_to_content': 'Saltar al contenido',
    'footer.copy': '© Guía de Fotografía de Viajes',
    'errors.not_found': 'Página no encontrada',
    'search.placeholder': 'Buscar ubicaciones...',
    'gallery.view_grid': 'Vista de cuadrícula',
    'gallery.view_list': 'Vista de lista',
    'upload.title': 'Subir Foto',
    'upload.select_file': 'Seleccionar archivo',
    'upload.location': 'Ubicación',
    'upload.tags': 'Etiquetas (separadas por comas)',
    'upload.description': 'Descripción',
    'upload.submit': 'Subir',
    'photo.edit': 'Editar metadatos',
    'photo.privacy': 'Privacidad',
    'photo.public': 'Pública',
    'photo.private': 'Privada',
    'photo.save': 'Guardar',
    'photo.share': 'Compartir',
    'photo.like': 'Me gusta',
    'photo.favorite': 'Favorito',
    'photo.comment.placeholder': 'Añade un comentario...',
    'photo.comment.submit': 'Comentar',
    'auth.email': 'Correo',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.or': 'o',
    'auth.login_with': 'Iniciar con',
    'settings.title': 'Ajustes',
  },
};

const I18nContext = React.createContext({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k,
});

// PUBLIC_INTERFACE
export function I18nProvider({ children }) {
  const [language, setLanguage] = React.useState('en');
  const t = React.useCallback((key) => translations[language]?.[key] || key, [language]);
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useI18n() {
  return React.useContext(I18nContext);
}
