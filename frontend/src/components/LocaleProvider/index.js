import React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import translationsForLocale from "locales";
import * as actions from "actions/SiteActions";

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
        this.props.changeSiteLocale(browserLocale);
      } else {
        // Fallback, set to defaultLanguage
        this.props.changeSiteLocale(defaultLanguage);
      }
    } else {
      // If user has lastLocale, make sure app has translations for locale
      if (translationsForLocale[lastLocale]) {
        return;
      } else {
        // If app has no translations for lastLocale, set to default locale
        this.props.changeSiteLocale(defaultLanguage);
      }
    }
  };

  render() {
    let { children, locale } = this.props;
    let { defaultLanguage } = this.state;

    return (
      <IntlProvider locale={locale} defaultLocale={defaultLanguage} messages={translationsForLocale[locale]}>
        {children}
      </IntlProvider>
    );
  }
}
function mapStateToProps(state) {
  return {
    locale: state.site.locale
  };
}

export default connect(mapStateToProps, actions)(LocaleProvider);
