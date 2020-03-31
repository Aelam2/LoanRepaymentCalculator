import React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import translationsForLocale from "locales";
import * as actions from "actions/UserActions";

class LocaleProvider extends React.Component {
  state = {
    defaultLanguage: "en-US"
  };

  componentDidMount = () => {
    let { defaultLanguage } = this.state;
    const browserLocale = navigator.language;
    const lastLocale = this.props.locale;

    // If user's locale is not set
    if (!lastLocale) {
      // If application has translations for their browser locale
      if (translationsForLocale[browserLocale]) {
        this.props.changeUserLanguage(browserLocale);
      } else {
        // Fallback, set to defaultLanguage
        this.props.changeUserLanguage(defaultLanguage);
      }
    } else {
      // If user has lastLocale, make sure app has translations for locale
      if (translationsForLocale[lastLocale]) {
        return;
      } else {
        // If app has no translations for lastLocale, set to default locale
        this.props.changeUserLanguage(defaultLanguage);
      }
    }
  };

  render() {
    let { children, locale } = this.props;
    let { defaultLanguage } = this.state;
    console.log(translationsForLocale[locale]);
    return (
      <IntlProvider locale={locale} defaultLocale={defaultLanguage} messages={translationsForLocale[locale]}>
        {children}
      </IntlProvider>
    );
  }
}
function mapStateToProps(state) {
  return {
    locale: state.user.settings.locale
  };
}

export default connect(mapStateToProps, actions)(LocaleProvider);
