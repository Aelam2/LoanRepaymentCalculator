export default {
  HighestBalanceFirst: {
    type: "HighestBalanceFirst",
    name: "Highest Balance First",
    description:
      "This strategy is calculated as a counter-point to the Debt Snowball (Lowest Balance) strategy to show how much of a difference the order makes.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var diff = Number(b.principal) - Number(a.principal);

        // If they have the same interest rate, want the one with the lowest balance first
        if (diff === 0) {
          return Number(b.rate) - Number(a.rate);
        }

        return diff;
      });
    }
  },
  LowestBalanceFirst: {
    type: "LowestBalanceFirst",
    name: "Debt Snowball (Lowest Balance First)",
    description:
      "By paying off loans with the lowest balance first you can increase your snowball quickly.  This is one of the most commonly promoted strategies and often is easier mentally and emotionally to execute since you are able to build momentum quickly and feel good about the progress you make.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var diff = a.principal - b.principal;

        // If they have the same interest rate, want the one with the lowest balance first
        if (diff === 0) {
          return b.rate - a.rate;
        }

        return diff;
      });
    }
  },
  HighestInterestRateFirst: {
    type: "HighestInterestRateFirst",
    name: "Debt Avalanche (Highest Interest Rate First)",
    description:
      "By paying off the loans with the highest interest rate first you often end up paying less in interest in total.  This will often save the most money, but may be the most mentally and emotionally challenging to execute since it often takes longer to feel like it is having any effect.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var diff = b.rate - a.rate;

        // If they have the same interest rate, want the one with the lowest balance first
        if (diff === 0) {
          return a.principal - b.principal;
        }

        return diff;
      });
    }
  },
  LowestInterestRateFirst: {
    type: "LowestInterestRateFirst",
    name: "Lowest Interest Rate First",
    description:
      "This strategy is calculated as a counter-point to the Debt Avalanche (Highest Interest Rate) strategy to show how much of a difference the order makes.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var diff = a.rate - b.rate;

        // If they have the same interest rate, want the one with the lowest balance first
        if (diff === 0) {
          return a.principal - b.principal;
        }

        return diff;
      });
    }
  },
  BalanceMinimumPaymentRatio: {
    type: "BalanceMinimumPaymentRatio",
    name: "Balance/Minimum Payment Ratio",
    description:
      "This strategy attempts to find debts that will be easy to pay off and add the most to your snowball for the next debt.  This is a preferred strategy as it can be mentally and emotionally easier than the Highest Interest Rate strategy and usually quicker than the Lowest Balance strategy.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var ratio = a.principal / a.minPayment - b.principal / b.minPayment;

        // If they have the same ratio, want the one with the lowest balance first
        if (ratio === 0) {
          return a.principal - b.principal;
        }

        return ratio;
      });
    }
  },
  BalanceInterestRateRatio: {
    type: "BalanceInterestRateRatio",
    name: "Balance/Interest Rate Ratio",
    description:
      "This strategy attempts to find debts that will be easy to pay off and add the most to your snowball for the next debt.  This is a preferred strategy as if can be mentally and emotionally easier than the Highest Interest Rate strategy and quicker than the Lowest Balance strategy.",
    sorter: loans => {
      return loans.sort((a, b) => {
        var ratio = a.principal / a.rate - b.principal / b.rate;

        // If they have the same ratio, want the one with the lowest balance first
        if (ratio === 0) {
          return a.principal - b.principal;
        }

        return ratio;
      });
    }
  }
};

export const StrategyCodeValueIdMap = {
  13: "HighestBalanceFirst",
  4: "LowestBalanceFirst",
  5: "HighestInterestRateFirst",
  14: "LowestInterestRateFirst",
  15: "BalanceMinimumPaymentRatio",
  16: "BalanceInterestRateRatio"
};
