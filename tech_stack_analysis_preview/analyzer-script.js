// Configuration
const CONFIG = {
    // TODO: Replace with your actual N8N webhook URLs
    ANALYZE_WEBHOOK_URL: 'https://your-n8n-instance.app/webhook/analyze-stack',
    REFRESH_WEBHOOK_URL: 'https://your-n8n-instance.app/webhook/refresh-analysis',
    GET_ANALYSIS_URL: 'https://your-n8n-instance.app/webhook/get-analysis'
};

// State
let currentAnalysisId = null;
let currentAnalysisData = null;

// DOM Elements
const formSection = document.getElementById('form-section');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const form = document.getElementById('stack-analyzer-form');
const analyzeBtn = document.getElementById('analyze-btn');
const refreshBtn = document.getElementById('refresh-btn');
const newAnalysisBtn = document.getElementById('new-analysis-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const resultsContent = document.getElementById('results-content');
const errorMessage = document.getElementById('error-message');

// Check URL for analysis ID on page load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const analysisId = urlParams.get('id');
    
    if (analysisId) {
        // Load analysis from URL parameter
        loadAnalysis(analysisId);
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        business_model: document.getElementById('businessModel').value.trim(),
        existing_tools: document.getElementById('existingTools').value
            .split(',')
            .map(tool => tool.trim())
            .filter(tool => tool.length > 0),
        revenue_type: document.getElementById('revenueType').value,
        company_stage: document.getElementById('stage').value
    };
    
    await analyzeStack(formData);
});

// New analysis button
newAnalysisBtn.addEventListener('click', () => {
    showFormSection();
    form.reset();
    currentAnalysisId = null;
    currentAnalysisData = null;
    window.history.pushState({}, '', window.location.pathname);
});

// Refresh analysis button
refreshBtn.addEventListener('click', async () => {
    if (!currentAnalysisId) {
        showError('No analysis to refresh');
        return;
    }
    
    await refreshAnalysis(currentAnalysisId);
});

// Try again button
tryAgainBtn.addEventListener('click', () => {
    showFormSection();
});

// Main analysis function
async function analyzeStack(formData) {
    setLoading(true);
    hideError();
    
    try {
        const response = await fetch(CONFIG.ANALYZE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentAnalysisId = result.analysis_id;
            currentAnalysisData = {
                ...result,
                user_input: formData
            };
            
            // Update URL without reload
            window.history.pushState({}, '', `?id=${result.analysis_id}`);
            
            displayResults(result);
            showResultsSection();
        } else {
            throw new Error(result.message || 'Analysis failed');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        showError(`Failed to analyze stack: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

// Refresh analysis function
async function refreshAnalysis(analysisId) {
    setLoading(true, 'Refreshing with latest sources...');
    hideError();
    
    try {
        const response = await fetch(CONFIG.REFRESH_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ analysis_id: analysisId })
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentAnalysisId = result.analysis_id;
            
            // Update URL
            window.history.pushState({}, '', `?id=${result.analysis_id}`);
            
            displayResults(result);
            showResultsSection();
            
            // Show version notification
            if (result.version > 1) {
                showNotification(`Created version ${result.version} with latest sources`);
            }
        } else {
            throw new Error(result.message || 'Refresh failed');
        }
    } catch (error) {
        console.error('Refresh error:', error);
        showError(`Failed to refresh analysis: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

// Load existing analysis
async function loadAnalysis(analysisId) {
    setLoading(true, 'Loading analysis...');
    hideError();
    
    try {
        const response = await fetch(`${CONFIG.GET_ANALYSIS_URL}?id=${analysisId}`);
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        currentAnalysisId = analysisId;
        currentAnalysisData = result;
        
        displayResults(result);
        showResultsSection();
    } catch (error) {
        console.error('Load error:', error);
        showError(`Failed to load analysis: ${error.message}`);
        showFormSection();
    } finally {
        setLoading(false);
    }
}

// Display results
function displayResults(data) {
    const analysis = data.ai_response || data.analysis?.ai_response || {};
    const version = data.version || 1;
    
    let html = '';
    
    // Overall Rating
    if (analysis.overall_rating) {
        const ratingClass = analysis.overall_rating.toLowerCase();
        html += `
            <div class="rating-card ${ratingClass}">
                <div class="rating-badge ${ratingClass}">${analysis.overall_rating}</div>
                <p class="rating-explanation">${analysis.rating_explanation || ''}</p>
            </div>
        `;
    }
    
    // Existing Tools Analysis
    if (analysis.existing_tools_analysis) {
        const eta = analysis.existing_tools_analysis;
        html += `
            <div class="analysis-card">
                <h3>Your Existing Stack</h3>
        `;
        
        if (eta.strengths && eta.strengths.length > 0) {
            html += `
                <div class="analysis-subsection">
                    <h4>Strengths</h4>
                    <ul class="analysis-list">
                        ${eta.strengths.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (eta.constraints && eta.constraints.length > 0) {
            html += `
                <div class="analysis-subsection">
                    <h4>Constraints</h4>
                    <ul class="analysis-list">
                        ${eta.constraints.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (eta.gaps && eta.gaps.length > 0) {
            html += `
                <div class="analysis-subsection">
                    <h4>Gaps</h4>
                    <ul class="analysis-list">
                        ${eta.gaps.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    // Stack Recommendations
    if (analysis.stack_recommendations) {
        html += `
            <div class="analysis-card">
                <h3>Recommended Stack</h3>
                <div class="stack-grid">
        `;
        
        for (const [category, details] of Object.entries(analysis.stack_recommendations)) {
            const statusClass = details.status || 'recommended';
            html += `
                <div class="stack-item ${statusClass}">
                    <span class="stack-status ${statusClass}">${statusClass}</span>
                    <div class="stack-category">${category.toUpperCase()}</div>
                    <div class="stack-tool">${details.tool || 'TBD'}</div>
                    <div class="stack-reason">${details.reason || ''}</div>
                    ${details.citation ? `<div class="stack-citation">${details.citation}</div>` : ''}
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Implementation Priority
    if (analysis.implementation_priority && analysis.implementation_priority.length > 0) {
        html += `
            <div class="analysis-card">
                <h3>Implementation Priority</h3>
                <ol class="priority-list">
                    ${analysis.implementation_priority.map(item => `<li>${item}</li>`).join('')}
                </ol>
            </div>
        `;
    }
    
    // Sources Used
    if (analysis.sources_used && analysis.sources_used.length > 0) {
        html += `
            <div class="analysis-card">
                <h3>Sources Referenced</h3>
                <div class="sources-list">
                    ${analysis.sources_used.map(source => `<span class="source-tag">${source}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    resultsContent.innerHTML = html;
    
    // Update version in header if > 1
    if (version > 1) {
        const resultsHeader = document.querySelector('.results-header h2');
        if (resultsHeader && !resultsHeader.querySelector('.version-badge')) {
            resultsHeader.innerHTML += ` <span class="version-badge">v${version}</span>`;
        }
    }
}

// UI State Management
function showFormSection() {
    formSection.style.display = 'block';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
}

function showResultsSection() {
    formSection.style.display = 'none';
    resultsSection.style.display = 'block';
    errorSection.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    formSection.style.display = 'none';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'block';
}

function hideError() {
    errorSection.style.display = 'none';
}

function setLoading(isLoading, message = 'Analyzing...') {
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoading = analyzeBtn.querySelector('.btn-loading');
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        btnLoading.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
        analyzeBtn.disabled = true;
        if (refreshBtn) refreshBtn.disabled = true;
    } else {
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
        analyzeBtn.disabled = false;
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

function showNotification(message) {
    // Simple notification - you could enhance this
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--growth-green);
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}






