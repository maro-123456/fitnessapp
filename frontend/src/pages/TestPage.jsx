import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function TestPage() {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    console.log('TestPage - User:', user);
    setTestData({
      user: user ? 'OUI' : 'NON',
      token: localStorage.getItem('token') ? 'OUI' : 'NON',
      language: localStorage.getItem('language') || 'fr'
    });
  }, [user]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Page de Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Données de test:</h2>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Utilisateur connecté:</h2>
        <p>{user ? `OUI - ${user.name}` : 'NON'}</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Langue actuelle:</h2>
        <p>{t('loading')}</p>
      </div>
      <div>
        <h2>Tous les contextes:</h2>
        <p>AuthContext: {user ? 'Disponible' : 'Non disponible'}</p>
        <p>LanguageContext: Disponible</p>
      </div>
    </div>
  );
}
