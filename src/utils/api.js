import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useApiBase() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields.apiBase;
}