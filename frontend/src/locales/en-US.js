import Forms from "./en-US/Forms";
import TopNavigation from "./en-US/TopNavigation";
import DashboardPage from "./en-US/DashboardPage";
import PaymentSchedulePage from "./en-US/PaymentSchedulePage";
import ResourcesPage from "./en-US/ResourcesPage";
import UserProfilePage from "./en-US/UserProfilePage";
import UserSignInPage from "./en-US/UserSignInPage";
import UserSignUpPage from "./en-US/UserSignUpPage";

export default {
  "navBar.lang": "Languages",
  "application.title": "Loan Payoff Calculator",
  "application.description": "Payoff Loans Smarter and Faster",

  ...Forms,
  ...TopNavigation,
  ...DashboardPage,
  ...PaymentSchedulePage,
  ...ResourcesPage,
  ...UserProfilePage,
  ...UserSignInPage,
  ...UserSignUpPage
};
