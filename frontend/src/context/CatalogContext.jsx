import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CatalogContext = createContext(null);

/**
 * Bumping `version` lets storefront pages refetch products after admin catalog changes.
 */
export function CatalogProvider({ children }) {
  const [version, setVersion] = useState(0);
  const bumpCatalog = useCallback(() => setVersion((v) => v + 1), []);

  const value = useMemo(() => ({ catalogVersion: version, bumpCatalog }), [version, bumpCatalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
