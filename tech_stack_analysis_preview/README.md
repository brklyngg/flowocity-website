# Finance Stack Analyzer - Frontend

This is the user-facing interface for the N8N Finance Stack Analyzer workflow.

## Setup Instructions

### 1. Configure N8N Webhook URLs

Edit `analyzer-script.js` and update the `CONFIG` object with your actual N8N webhook URLs:

```javascript
const CONFIG = {
    ANALYZE_WEBHOOK_URL: 'https://your-n8n-instance.app/webhook/analyze-stack',
    REFRESH_WEBHOOK_URL: 'https://your-n8n-instance.app/webhook/refresh-analysis',
    GET_ANALYSIS_URL: 'https://your-n8n-instance.app/webhook/get-analysis'
};
```

### 2. N8N Webhooks Required

You need to create these three webhooks in your N8N workflow:

1. **`/analyze-stack`** (POST) - Initial analysis
   - Receives: `{ business_model, existing_tools, revenue_type, company_stage }`
   - Returns: `{ success, analysis_url, analysis_id, created_at, version, preview }`

2. **`/refresh-analysis`** (POST) - Refresh with updated sources
   - Receives: `{ analysis_id }`
   - Returns: Same as analyze-stack, with incremented version

3. **`/get-analysis`** (GET) - Retrieve existing analysis
   - Receives: `?id=analysis_id`
   - Returns: Full analysis data including `ai_response`

### 3. Deploy

Push to GitHub - Netlify will auto-deploy.

### 4. Access the Tool

The analyzer will be available at:
```
https://www.flowocity.ai/tech_stack_analysis_preview
```

## Features

- ✅ Clean form matching Flowocity design
- ✅ Real-time analysis via N8N
- ✅ Shareable URLs for each analysis
- ✅ Refresh capability for updated sources
- ✅ Version tracking
- ✅ Source citations displayed
- ✅ Non-crawlable (robots.txt configured)
- ✅ Mobile responsive
- ✅ Loading states and error handling

## Form Fields

1. **Business Model** (required) - Textarea describing revenue model
2. **Existing Tools** - Comma-separated list of current tools
3. **Revenue Type** (required) - Dropdown: Subscription, Usage, or Hybrid
4. **Company Stage** (required) - Dropdown: Pre-Seed, Seed, Series A, Series B+

## Results Display

The analysis shows:
- Overall stack rating (Ideal/Workable/Risky)
- Existing tools analysis (strengths, constraints, gaps)
- Recommended stack by category (CRM, Billing, Payments, RevRec, GL, FP&A)
- Implementation priority steps
- Sources referenced

## Notes

- The page is excluded from search engine indexing
- Each analysis gets a unique shareable URL with `?id=` parameter
- Refresh creates a new versioned analysis (doesn't modify original)
- All assertions are grounded in source documents with citations

