import Forms from "./es/Forms";
import TopNavigation from "./es/TopNavigation";
import DashboardPage from "./es/DashboardPage";
import PaymentSchedulePage from "./es/PaymentSchedulePage";
import ResourcesPage from "./es/ResourcesPage";
import UserProfilePage from "./es/UserProfilePage";
import UserSignInPage from "./es/UserSignInPage";
import UserSignUpPage from "./es/UserSignUpPage";
import UserPasswordReset from "./es/UserPasswordReset";

export default {
  "navBar.lang": "Idiomas",
  "application.title": "Reembolso.dev",
  "application.description": "Préstamos de pago más inteligentes y rápidos",

  ...Forms,
  ...TopNavigation,
  ...DashboardPage,
  ...PaymentSchedulePage,
  ...ResourcesPage,
  ...UserProfilePage,
  ...UserSignInPage,
  ...UserSignUpPage,
  ...UserPasswordReset
};
