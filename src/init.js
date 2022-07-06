import i18n from 'i18next';
import resources from './locales/index.js';
import { renderText } from "./view.js";


export default async () => {
  const i18nextInstance = i18n.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });
  renderText(i18nextInstance);
};
