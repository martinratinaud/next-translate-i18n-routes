import useTranslation from 'next-translate/useTranslation';
import { Link } from 'modules/I18n';
import { useRouter } from 'next/router';

const ChangeLanguage = () => {
  const { t } = useTranslation();
  const { locale, locales } = useRouter();

  if (!locales) return null;

  return locales.map((lng) => {
    if (lng === locale) return null;

    return (
      <Link href="/" locale={lng} key={lng}>
        {t(`common:cta`, { lang: lng })}
      </Link>
    );
  });
};

export default ChangeLanguage;
