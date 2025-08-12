# Test Suite - Financial Questions

## Overview
This test suite contains the sample financial questions from the assessment to demonstrate the chatbot's capabilities across various financial domains.

## Test Questions

### 1. Retirement Planning
**Question**: "What is the difference between a Roth IRA and a Traditional IRA?"
**Expected Response**: Clear comparison of tax treatment, contribution limits, withdrawal rules

### 2. Investment Allocation
**Question**: "How should I allocate my 401(k) investments?"
**Expected Response**: Age-based allocation strategies, risk tolerance considerations

### 3. Financial Ratios
**Question**: "What's a good debt-to-income ratio?"
**Expected Response**: Specific percentage ranges, impact on financial health

### 4. Emergency Planning
**Question**: "How do I create an emergency fund?"
**Expected Response**: Step-by-step process, recommended fund size

### 5. Financial Prioritization
**Question**: "Should I pay off my student loans or invest in the stock market?"
**Expected Response**: Comparative analysis based on interest rates and returns

### 6. Investment Strategies
**Question**: "What is dollar-cost averaging?"
**Expected Response**: Definition, benefits, implementation strategy

### 7. Market Impact
**Question**: "How do interest rate changes affect my mortgage?"
**Expected Response**: Relationship between rates and mortgage payments

### 8. Financial Calculations
**Question**: "What's the rule of 72?"
**Expected Response**: Formula explanation and practical applications

### 9. Retirement Savings
**Question**: "How much should I save for retirement?"
**Expected Response**: Percentage recommendations, calculation methods

### 10. Market Analysis
**Question**: "What are current market trends affecting tech stocks?"
**Expected Response**: General market factors, tech sector considerations

## Testing Instructions

1. **Manual Testing**: Copy each question into the chat interface
2. **Response Evaluation**: Check for accuracy, clarity, and completeness
3. **Format Verification**: Ensure proper markdown formatting and disclaimers
4. **Error Handling**: Test with unclear or non-financial questions

## Expected Response Quality

### All responses should include:
- ✅ Accurate financial information
- ✅ Clear, accessible language
- ✅ Specific numerical data where appropriate
- ✅ Actionable recommendations
- ✅ Proper disclaimers for investment advice
- ✅ Professional formatting with markdown

### Response Format Example:
```
**Topic Overview**: Brief explanation
**Key Points**:
- Point 1 with specific data
- Point 2 with examples
- Point 3 with recommendations

**Final Recommendation**: Specific actionable advice

*Disclaimer: This is for informational purposes only and not professional financial advice.*
```

## Automated Testing (Future Enhancement)

```typescript
// Example test structure for future implementation
describe('Financial Chatbot Tests', () => {
  const testQuestions = [
    {
      question: "What is the difference between a Roth IRA and a Traditional IRA?",
      expectedKeywords: ["tax", "contribution", "withdrawal", "retirement"]
    },
    // Additional test cases...
  ];

  testQuestions.forEach(test => {
    it(`should handle: ${test.question}`, async () => {
      const response = await chatService.sendMessage(test.question);
      expect(response).toContain(test.expectedKeywords);
    });
  });
});
```