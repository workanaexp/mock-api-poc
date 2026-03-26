import { useRef, useState } from 'react'
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
  const [newReportTitle, setNewReportTitle] = useState('')
  const [includeDescription, setIncludeDescription] = useState(false)
  const [newReportDescription, setNewReportDescription] = useState('')
  const [createReportLoading, setCreateReportLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    if (toastTimeoutRef.current != null) {
      window.clearTimeout(toastTimeoutRef.current)
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

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

  const searchReports = async (term?: string) => {
    setReportsLoading(true)
    setReportsFetched(true)
    try {
      const url = new URL('/api/reports', window.location.origin)
      const searchTerm = (term ?? reportSearch).trim()
      if (searchTerm) url.searchParams.set('search', searchTerm)
      const response = await fetch(url.toString())
      const data = (await response.json()) as Report[]
      setReports(Array.isArray(data) ? data : [])
    } finally {
      setReportsLoading(false)
    }
  }

  const handleSearchReportsClick = () => {
    void searchReports()
  }

  const createReport = async () => {
    const title = newReportTitle.trim()
    if (!title) return

    const description = includeDescription
      ? newReportDescription.trim()
      : ''

    setCreateReportLoading(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to create report', await response.text())
        return
      }

      setNewReportTitle('')
      setIncludeDescription(false)
      setNewReportDescription('')

      // Remove the created report from the visible list on purpose.
      // The user should use the search input to find what they just created.
      setReportSearch('')
      setReports([])
      setReportsFetched(false)
    } finally {
      setCreateReportLoading(false)
      showToast(
        language === 'en'
          ? 'Report created successfully'
          : 'Relatório criado com sucesso',
      )
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
        ? 'Mocked with MSW + @msw/data. Type a term (e.g. "sales", "audit", "report") and search.'
        : 'Mockado com MSW + @msw/data. Digite um termo (ex: "vendas", "auditoria") e busque.',
    searchPlaceholder: language === 'en' ? 'Search by title or description...' : 'Buscar por título ou descrição...',
    searchButton: language === 'en' ? 'Search' : 'Buscar',
    newReportTitlePlaceholder:
      language === 'en' ? 'New report title...' : 'Título do novo relatório...',
    saveReportButton: language === 'en' ? 'Save report' : 'Salvar relatório',
    savingReportButton: language === 'en' ? 'Saving...' : 'Salvando...',
    addDescriptionLabel: language === 'en' ? 'Add description' : 'Incluir descrição',
    descriptionPlaceholder:
      language === 'en' ? 'Description (optional)...' : 'Descrição (opcional)...',
    noReports: language === 'en' ? 'No reports found.' : 'Nenhum relatório encontrado.',
    dateLabel: language === 'en' ? 'Created' : 'Criado em',
  }

  return (
    <main className={styles.root}>
      {toastMessage && (
        <div className={styles.toast} role="status">
          {toastMessage}
        </div>
      )}
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
              onKeyDown={(e) => e.key === 'Enter' && void searchReports()}
              aria-label={t.searchPlaceholder}
            />
            <button
              type="button"
              className={styles.apiButton}
              onClick={handleSearchReportsClick}
              disabled={reportsLoading}
            >
              {reportsLoading
                ? language === 'en'
                  ? 'Loading...'
                  : 'Carregando...'
                : t.searchButton}
            </button>
          </div>

          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t.newReportTitlePlaceholder}
              value={newReportTitle}
              onChange={(e) => setNewReportTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createReport()}
              aria-label={t.newReportTitlePlaceholder}
            />
            <button
              type="button"
              className={styles.apiButton}
              onClick={createReport}
              disabled={createReportLoading}
            >
              {createReportLoading
                ? language === 'en'
                  ? t.savingReportButton
                  : t.savingReportButton
                : t.saveReportButton}
            </button>
          </div>

          <div className={styles.searchRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeDescription}
                onChange={(e) => setIncludeDescription(e.target.checked)}
                aria-label={t.addDescriptionLabel}
              />
              {t.addDescriptionLabel}
            </label>
          </div>

          {includeDescription && (
            <div className={styles.searchRow}>
              <textarea
                className={styles.descriptionInput}
                placeholder={t.descriptionPlaceholder}
                value={newReportDescription}
                onChange={(e) => setNewReportDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createReport()}
                aria-label={t.descriptionPlaceholder}
              />
            </div>
          )}

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
