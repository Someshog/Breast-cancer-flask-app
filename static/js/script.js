// JavaScript for Breast Cancer Prediction App

// Sample data for testing (new default values)
const sampleData = {
    'mean radius': 14.6,
    'mean texture': 22.7,
    'mean perimeter': 96.4,
    'mean area': 657,
    'mean smoothness': 0.085,
    'mean compactness': 0.133, 
    'mean concavity': 0.103,
    'mean concave points': 0.04,
    'mean symmetry': 0.1654,
    'mean fractal dimension': 0.05147,
    'radius error': 0.3354,
    'texture error': 1.108,
    'perimeter error': 2.244,
    'area error': 19.74,
    'smoothness error': 0.004342,
    'compactness error': 0.04649,
    'concavity error': 0.06578,
    'concave points error': 0.01506,
    'symmetry error': 0.01738,
    'fractal dimension error': 0.0045406,
    'worst radius': 13.48,
    'worst texture': 37.27,
    'worst perimeter': 105.9,
    'worst area': 734.5,
    'worst smoothness': 0.1206,
    'worst compactness': 0.317,
    'worst concavity': 0.3682,
    'worst concave points': 0.1305,
    'worst symmetry': 0.2348,
    'worst fractal dimension': 0.08004
};

// Form submission handler with optimized processing
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    const resultsSection = document.getElementById('results-section');
    let submitButton;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get submit button and show loading state immediately
        submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Validate form first (quick check)
        if (!validateForm()) {
            showError('Please fill in all required fields with valid numbers.');
            return;
        }
        
        // Show immediate loading feedback
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        
        // Show loading modal using direct manipulation for better control
        setTimeout(() => {
            const modal = document.getElementById('loadingModal');
            modal.style.display = 'block';
            modal.classList.add('show');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
            modal.removeAttribute('aria-hidden');
            
            // Add backdrop manually
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop show';
            backdrop.id = 'custom-backdrop';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
            
            // Start animated progress bar and loading messages
            startLoadingAnimation();
        }, 100);
        
        // Store the start time for minimum loading duration
        const loadingStartTime = Date.now();
        const minimumLoadingTime = 2000; // 2 seconds
        
        // Collect form data efficiently
        const formData = new FormData(form);
        
        // Send prediction request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        fetch('/predict', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Calculate remaining time to show loading for minimum 2 seconds
            const elapsedTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
            
            // Wait for remaining time, then close modal and show results
            setTimeout(() => {
                // Immediately force close modal
                forceCloseModal();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                if (data.error) {
                    showError(data.error);
                } else {
                    // Show results after a brief delay to ensure modal is closed
                    setTimeout(() => {
                        showResults(data);
                    }, 200);
                }
            }, remainingTime);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            
            // Calculate remaining time to show loading for minimum 2 seconds (even for errors)
            const elapsedTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
            
            // Wait for remaining time, then close modal and show error
            setTimeout(() => {
                // Immediately force close modal
                forceCloseModal();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                if (error.name === 'AbortError') {
                    showError('Request timed out. Please try again with valid data.');
                } else {
                    showError('Network error occurred. Please check your connection and try again.');
                }
                console.error('Error:', error);
            }, remainingTime);
        });
    });
});

// Animated loading progress and messages
function startLoadingAnimation() {
    const progressBar = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    
    const messages = [
        'Initializing analysis...',
        'Processing cell measurements...',
        'Applying machine learning model...',
        'Calculating probabilities...',
        'Finalizing results...'
    ];
    
    let currentMessage = 0;
    let progress = 0;
    
    // Animate progress bar from 0 to 100% over 2 seconds
    const progressInterval = setInterval(() => {
        progress += 2; // Increase by 2% every 40ms (2000ms / 50 steps = 40ms)
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 40);
    
    // Change loading message every 400ms
    const messageInterval = setInterval(() => {
        if (currentMessage < messages.length - 1) {
            currentMessage++;
            loadingText.textContent = messages[currentMessage];
        } else {
            clearInterval(messageInterval);
        }
    }, 400);
    
    // Store intervals for cleanup
    window.loadingIntervals = { progressInterval, messageInterval };
}

// Stop loading animation
function stopLoadingAnimation() {
    if (window.loadingIntervals) {
        clearInterval(window.loadingIntervals.progressInterval);
        clearInterval(window.loadingIntervals.messageInterval);
        window.loadingIntervals = null;
    }
}

// Fill form with sample data
function fillSampleData() {
    for (const [fieldName, value] of Object.entries(sampleData)) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.value = value;
            
            // Add animation to show the field was filled
            field.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                field.style.backgroundColor = '';
            }, 500);
        }
    }
    
    // Scroll to top of form
    document.getElementById('prediction-form').scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    showToast('Sample data filled successfully!', 'success');
}

// Show prediction results with proper modal handling
function showResults(data) {
    // Ensure modal is completely gone before showing results
    forceCloseModal();
    
    // Wait a bit more to ensure cleanup is complete
    setTimeout(() => {
        displayResults(data);
    }, 100);
}

// Separate function to display results
function displayResults(data) {
    const resultsSection = document.getElementById('results-section');
    const resultDiv = document.getElementById('prediction-result');
    
    // Determine result styling
    const isBenign = data.prediction === 'Benign';
    const cardClass = isBenign ? 'bg-success' : 'bg-warning';
    const iconClass = isBenign ? 'fa-check-circle' : 'fa-exclamation-triangle';
    const statusIcon = isBenign ? 'fa-smile' : 'fa-frown';
    
    // Update card header
    const cardHeader = document.querySelector('#results-card .card-header');
    cardHeader.className = `card-header text-white ${cardClass}`;
    
    // Create results HTML
    resultDiv.innerHTML = `
        <div class="text-center">
            <i class="fas ${statusIcon} status-icon ${isBenign ? 'text-success' : 'text-warning'}"></i>
            <h2 class="mb-4">
                <i class="fas ${iconClass} me-2"></i>
                Prediction: <span class="${isBenign ? 'text-success' : 'text-warning'}">${data.prediction}</span>
            </h2>
            <div class="row">
                <div class="col-md-6">
                    <div class="card border-0 ${isBenign ? 'bg-light' : 'bg-light'}">
                        <div class="card-body">
                            <h5 class="card-title text-success">
                                <i class="fas fa-heart me-2"></i>
                                Benign Probability
                            </h5>
                            <div class="progress mb-2" style="height: 20px;">
                                <div class="progress-bar bg-success" role="progressbar" 
                                     style="width: ${data.confidence.benign}" 
                                     aria-valuenow="${parseFloat(data.confidence.benign)}" 
                                     aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                            <h3 class="text-success">${data.confidence.benign}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 bg-light">
                        <div class="card-body">
                            <h5 class="card-title text-danger">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Malignant Probability
                            </h5>
                            <div class="progress mb-2" style="height: 20px;">
                                <div class="progress-bar bg-danger" role="progressbar" 
                                     style="width: ${data.confidence.malignant}" 
                                     aria-valuenow="${parseFloat(data.confidence.malignant)}" 
                                     aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                            <h3 class="text-danger">${data.confidence.malignant}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <div class="alert ${isBenign ? 'alert-success' : 'alert-warning'}" role="alert">
                    <h5 class="alert-heading">
                        <i class="fas ${isBenign ? 'fa-check' : 'fa-exclamation-triangle'} me-2"></i>
                        Risk Level: ${data.risk_level}
                    </h5>
                    <p class="mb-0">
                        ${isBenign 
                            ? 'The model predicts this sample is likely benign (non-cancerous). However, always consult with healthcare professionals for proper medical diagnosis.'
                            : 'The model predicts this sample may be malignant (cancerous). This requires immediate attention from qualified healthcare professionals for proper diagnosis and treatment.'
                        }
                    </p>
                </div>
            </div>
            <div class="mt-3">
                <button type="button" class="btn btn-primary me-2" onclick="scrollToForm()">
                    <i class="fas fa-redo me-2"></i>
                    New Prediction
                </button>
                <button type="button" class="btn btn-outline-secondary" onclick="downloadResults()">
                    <i class="fas fa-download me-2"></i>
                    Download Results
                </button>
            </div>
        </div>
    `;
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('fade-in');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Animate progress bars
    setTimeout(() => {
        const progressBars = resultsSection.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

// Show error message
function showError(message) {
    showToast(message, 'danger');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${getToastIcon(type)} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Get or create toast container
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }
    return container;
}

// Get icon for toast type
function getToastIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

// Scroll to form
function scrollToForm() {
    document.getElementById('prediction-form').scrollIntoView({ behavior: 'smooth' });
}

// Download results (placeholder function)
function downloadResults() {
    // This would typically generate a PDF or CSV file
    showToast('Download feature coming soon!', 'info');
}

// Clear form
function clearForm() {
    document.getElementById('predictionForm').reset();
    document.getElementById('results-section').style.display = 'none';
    showToast('Form cleared successfully!', 'success');
}

// Validate form before submission with improved feedback
function validateForm() {
    const form = document.getElementById('predictionForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Check if empty
        if (!value) {
            input.classList.add('is-invalid');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = input;
        }
        // Check if valid number
        else if (isNaN(parseFloat(value)) || !isFinite(value)) {
            input.classList.add('is-invalid');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = input;
        }
        // Check if negative (most medical measurements should be positive)
        else if (parseFloat(value) < 0) {
            input.classList.add('is-invalid');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = input;
        }
        else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    // Scroll to first invalid field
    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// Real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Force close loading modal and cleanup
function forceCloseModal() {
    // Stop loading animation
    stopLoadingAnimation();
    
    // Get all possible modal elements
    const loadingModal = document.getElementById('loadingModal');
    const modal = bootstrap.Modal.getInstance(loadingModal);
    
    // Hide using Bootstrap modal instance
    if (modal) {
        modal.hide();
        modal.dispose(); // Dispose of the modal instance
    }
    
    // Force hide using direct manipulation
    if (loadingModal) {
        loadingModal.style.display = 'none';
        loadingModal.classList.remove('show');
        loadingModal.setAttribute('aria-hidden', 'true');
        loadingModal.removeAttribute('aria-modal');
        loadingModal.removeAttribute('role');
    }
    
    // Remove all modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Clean up body classes and styles
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    
    // Reset submit button if it exists
    const submitButton = document.querySelector('#predictionForm button[type="submit"]');
    if (submitButton && submitButton.disabled) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-search me-2"></i>Predict';
    }
    
    // Reset progress bar and loading text
    const progressBar = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
    }
    if (loadingText) {
        loadingText.textContent = 'Initializing analysis...';
    }
    
    console.log('Modal force closed and cleaned up');
}

// Add escape key listener to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        forceCloseModal();
    }
});

// Add periodic cleanup to prevent stuck modals
setInterval(() => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    if (backdrops.length > 0) {
        console.log('Found stuck modal backdrop, cleaning up...');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
    }
}, 5000); // Check every 5 seconds

// Add immediate cleanup when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Clean up any leftover modal elements from previous sessions
    setTimeout(() => {
        forceCloseModal();
    }, 500);
});
