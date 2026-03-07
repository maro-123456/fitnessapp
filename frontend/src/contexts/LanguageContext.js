import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || key;
    
    // Remplacer les paramètres dans le texte
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  // Direction du texte (RTL pour l'arabe)
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
