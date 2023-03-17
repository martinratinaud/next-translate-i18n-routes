import { LanguageSwitcher, useTranslation } from 'modules/I18n';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <section>
      <LanguageSwitcher />
      <br />
      <br />
      <div>{t('common:variable-example', { count: 42 })}</div>
    </section>
  );
};

export default HomePage;
