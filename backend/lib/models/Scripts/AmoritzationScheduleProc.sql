/****** Object:  StoredProcedure [dbo].[LoanAmortizationSchedule]    Script Date: 4/13/2020 4:02:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
ALTER PROCEDURE [dbo].[LoanAmortizationSchedule]
  (@UserID INT,
  @Consolidated BIT)
AS
BEGIN
  ;

  WITH
    Payments
    AS
    (
              SELECT LoanID
			, UserID
			, PaymentNo = 0
			, PaymentStart
			, Balance = CAST(LoanBalance AS MONEY)
			, Payment = CAST(NULL AS MONEY)
			, Principal = CAST(NULL AS MONEY)
			, Interest = CAST(NULL AS MONEY)
			, CumInt = CAST(0 AS MONEY) -- Cumulative Interest
			, R -- APR converted to a monthly rate
			, Pmt = CAST(PaymentMinimum AS MONEY) -- Calculate the monthly payment amount only once (in the anchor of the rCTE)
			, Period = CAST(CAST(LoanBalance AS MONEY) / CAST(PaymentMinimum AS MONEY) as Float)
			, DateDeleted
        FROM Loans
		CROSS APPLY (
			SELECT R = CAST((InterestRate) / 12. AS MONEY)
			) x

      UNION ALL

        SELECT LoanID
			, UserID
			, PaymentNo + 1
			, DATEADD(month, 1, PaymentStart)
			, Balance = CASE PaymentNo + 1
				WHEN Period
					THEN 0
				ELSE Balance - (Pmt - ROUND(R * Balance, 2))
				END
			, Payment = Pmt
			, Principal = CASE PaymentNo + 1
				WHEN Period
					THEN Balance
				ELSE Pmt - ROUND(R * Balance, 2)
				END
			, Interest = CASE PaymentNo + 1
				WHEN Period
					THEN Pmt - Balance
				ELSE ROUND(R * Balance, 2)
				END
			, CumInt = CASE PaymentNo + 1
				WHEN Period
					THEN CumInt + Pmt - Balance
				ELSE ROUND(CumInt + R * Balance, 2)
				END
			, R
			, Pmt
			, Period
			, DateDeleted
        FROM Payments
        WHERE PaymentNo < Period
    )
  SELECT LoanID
		, PaymentNo AS No
		, DATEADD(month, DATEDIFF(month, 0, PaymentStart), 0) AS PaymentDate
		, Balance
		, Payment
		, Principal
		, Interest
		, CumInt
  FROM Payments
  WHERE UserID = @UserID and DateDeleted IS NULL
  ORDER BY LoanID
		,PaymentNo
  OPTION
  (MAXRECURSION
  360)
END
