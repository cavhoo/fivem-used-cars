import { Language } from '../../common';
import en from '../../common/lang/en.json';
import de from '../../common/lang/de.json';

/** Translate the given key with the provided translations. */
export class Translation {
  /** The language set through the config. */
  public static selectedLanguage: Language;

  /** Return the translation for the given key, if the translation is missing return key. */
  public static get(key: keyof typeof en): string {
    return this.getTranslationFile[key] ?? key;
  }

  /** Returns the correct file for the translation based on language set. (Default en). */
  protected static get getTranslationFile(): typeof en {
    switch (this.selectedLanguage) {
      case 'de':
        return de;
      default:
        return en;
    }
  }
}
