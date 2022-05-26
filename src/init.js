import i18n from 'i18next';
import resources from './locales/index.js';

export default async () => {
  const i18nextInstance = i18n.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });
  await console.log(i18nextInstance);
};
