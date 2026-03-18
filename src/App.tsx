import { useState } from 'react'
import styles from './App.module.scss'

type Language = 'en' | 'pt'

type UserResponse = {
  id: string
  name: string
}

type Report = {
  id: string
  title: string
  description: string
  createdAt: string
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportSearch, setReportSearch] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsFetched, setReportsFetched] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user')
      const data = (await response.json()) as UserResponse
      setUser(data)
    } finally {
      setLoading(false)
    }
  }

  const searchReports = async () => {
    setReportsLoading(true)
    setReportsFetched(true)
    try {
      const url = new URL('/api/reports', window.location.origin)
      if (reportSearch.trim()) url.searchParams.set('search', reportSearch.trim())
      const response = await fetch(url.toString())
      const data = (await response.json()) as Report[]
      setReports(Array.isArray(data) ? data : [])
    } finally {
      setReportsLoading(false)
    }
  }

  const t = {
    title: language === 'en' ? 'React + Vite + MSW boilerplate' : 'Boilerplate React + Vite + MSW',
    subtitle:
      language === 'en'
        ? 'API mocking ready for development and tests.'
        : 'Mock de API pronto para desenvolvimento e testes.',
    badge: language === 'en' ? 'Mock Service Worker enabled' : 'Mock Service Worker ativo',
    fetchButton: language === 'en' ? 'Call mocked API /api/user' : 'Chamar API mockada /api/user',
    responseLabel: language === 'en' ? 'Last response' : 'Última resposta',
    hint:
      language === 'en'
        ? 'Toggle MSW in development via'
        : 'Ative ou desative o MSW em dev via',
    reportsTitle: language === 'en' ? 'Reports search (POC)' : 'Busca de relatórios (POC)',
    reportsDesc:
      language === 'en'
        ? 'Mocked with MSW + @msw/data. Type a term (e.g. "vendas", "auditoria") and search.'
        : 'Mockado com MSW + @msw/data. Digite um termo (ex: "vendas", "auditoria") e busque.',
    searchPlaceholder: language === 'en' ? 'Search by title or description...' : 'Buscar por título ou descrição...',
    searchButton: language === 'en' ? 'Search' : 'Buscar',
    noReports: language === 'en' ? 'No reports found.' : 'Nenhum relatório encontrado.',
    dateLabel: language === 'en' ? 'Created' : 'Criado em',
  }

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.badge}>{t.badge}</p>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div className={styles.languageToggle}>
          <button type="button" data-active={language === 'en'} onClick={() => setLanguage('en')}>
            EN
          </button>
          <span className={styles.languageDivider} />
          <button type="button" data-active={language === 'pt'} onClick={() => setLanguage('pt')}>
            PT-BR
          </button>
        </div>
      </header>

      <section className={styles.pillRow}>
        <span className={styles.pill}>React 18 + TypeScript</span>
        <span className={styles.pill}>Vite</span>
        <span className={styles.pill}>Vitest + Testing Library</span>
        <span className={styles.pill}>MSW</span>
        <span className={styles.pill}>Sass Modules</span>
        <span className={styles.pill}>ESLint</span>
        <span className={styles.pill}>Husky + lint-staged</span>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {language === 'en' ? 'Try the mocked API' : 'Teste a API mockada'}
          </h2>
          <p className={styles.cardBody}>
            {language === 'en'
              ? 'This button calls `/api/user`, which is intercepted by MSW both in the browser and in tests.'
              : 'Este botão chama `/api/user`, que é interceptado pelo MSW tanto no navegador quanto nos testes.'}
          </p>

          <button
            type="button"
            className={styles.apiButton}
            onClick={fetchUser}
            disabled={loading}
          >
            {loading
              ? language === 'en'
                ? 'Loading...'
                : 'Carregando...'
              : t.fetchButton}
          </button>

          {user && (
            <div className={styles.response}>
              <strong>{t.responseLabel}:</strong> {JSON.stringify(user)}
            </div>
          )}

          <p className={styles.hint}>
            {t.hint}{' '}
            <code className={styles.hintCode}>
              {language === 'en' ? 'src/main.tsx' : 'arquivo src/main.tsx'}
            </code>
            .
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{t.reportsTitle}</h2>
          <p className={styles.cardBody}>{t.reportsDesc}</p>
          <div className={styles.searchRow}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchReports()}
              aria-label={t.searchPlaceholder}
            />
            <button
              type="button"
              className={styles.apiButton}
              onClick={searchReports}
              disabled={reportsLoading}
            >
              {reportsLoading
                ? language === 'en'
                  ? 'Loading...'
                  : 'Carregando...'
                : t.searchButton}
            </button>
          </div>
          {reports.length > 0 && (
            <ul className={styles.reportList} role="list">
              {reports.map((r) => (
                <li key={r.id} className={styles.reportItem}>
                  <strong className={styles.reportTitle}>{r.title}</strong>
                  <p className={styles.reportDesc}>{r.description}</p>
                  <span className={styles.reportMeta}>
                    {t.dateLabel}: {new Date(r.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {reports.length === 0 && reportsFetched && !reportsLoading && (
            <p className={styles.cardBody}>{t.noReports}</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
