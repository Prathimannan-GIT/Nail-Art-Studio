// Nail Art Studio - Main JavaScript File

// ===== DOM ELEMENTS =====
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupHeader();
    setupMobileMenu();
    setupNavigation();
    setupGalleryFilter();
    setupScrollAnimations();
    setupFormValidation();
    setupSmoothScrolling();
}

// ===== HEADER FUNCTIONALITY =====
function setupHeader() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    
    if (menuToggle && navCenter) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navCenter.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navCenter.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                navCenter.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on nav links (mobile)
        const navLinks = navCenter.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navCenter.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Match current page with navigation
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== GALLERY FILTER =====
function setupGalleryFilter() {
    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .gallery-item, .pricing-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitForm(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('.form-control[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (fieldType === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (fieldType === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.getAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
    }
    
    // Show error
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function submitForm(form) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== APPOINTMENT BOOKING =====
function setupAppointmentBooking() {
    const dateInput = document.getElementById('appointment-date');
    const timeSlots = document.querySelectorAll('.time-slot');
    const serviceSelect = document.getElementById('service-select');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        dateInput.addEventListener('change', function() {
            loadAvailableTimeSlots(this.value);
        });
    }
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Service selection
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            updatePricingDisplay(this.value);
        });
    }
}

function loadAvailableTimeSlots(date) {
    // Simulate loading available time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    const availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    timeSlots.forEach(slot => {
        const time = slot.textContent.trim();
        if (availableSlots.includes(time)) {
            slot.classList.remove('disabled');
            slot.style.pointerEvents = 'auto';
            slot.style.opacity = '1';
        } else {
            slot.classList.add('disabled');
            slot.style.pointerEvents = 'none';
            slot.style.opacity = '0.5';
        }
    });
}

function updatePricingDisplay(serviceId) {
    const prices = {
        'manicure': 45,
        'pedicure': 55,
        'gel-nails': 65,
        'nail-art': 75,
        'acrylic': 85
    };
    
    const priceDisplay = document.getElementById('price-display');
    if (priceDisplay && prices[serviceId]) {
        priceDisplay.textContent = `$${prices[serviceId]}`;
    }
}

// ===== DASHBOARD FUNCTIONALITY =====
function setupDashboard() {
    setupSidebarNavigation();
    setupDataCharts();
    setupUserManagement();
    setupAppointmentManagement();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Load content (in real app, this would load from server)
            const page = this.getAttribute('data-page');
            loadDashboardPage(page);
        });
    });
}

function loadDashboardPage(page) {
    const mainContent = document.querySelector('.dashboard-main');
    
    // Show loading state
    mainContent.innerHTML = '<div class="spinner"></div>';
    
    // Simulate page loading
    setTimeout(() => {
        // In real app, this would fetch content from server
        console.log(`Loading ${page} page`);
    }, 500);
}

function setupDataCharts() {
    // Initialize charts for dashboard
    const chartElements = document.querySelectorAll('.chart-container');
    
    chartElements.forEach(chart => {
        // Simple chart initialization (in real app, use Chart.js or similar)
        chart.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        chart.style.borderRadius = '8px';
        chart.style.height = '200px';
        chart.style.display = 'flex';
        chart.style.alignItems = 'center';
        chart.style.justifyContent = 'center';
        chart.style.color = 'white';
        chart.innerHTML = '<p>Chart Data</p>';
    });
}

function setupUserManagement() {
    const userTable = document.querySelector('.users-table');
    
    if (userTable) {
        // Add row hover effects
        const rows = userTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f8f9fa';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    }
}

function setupAppointmentManagement() {
    const appointmentCards = document.querySelectorAll('.appointment-card');
    
    appointmentCards.forEach(card => {
        const statusSelect = card.querySelector('.status-select');
        
        if (statusSelect) {
            statusSelect.addEventListener('change', function() {
                updateAppointmentStatus(card, this.value);
            });
        }
    });
}

function updateAppointmentStatus(card, status) {
    const statusBadge = card.querySelector('.status-badge');
    
    // Update badge styling based on status
    statusBadge.className = `status-badge status-${status}`;
    
    switch(status) {
        case 'confirmed':
            statusBadge.style.background = '#27ae60';
            break;
        case 'pending':
            statusBadge.style.background = '#f39c12';
            break;
        case 'cancelled':
            statusBadge.style.background = '#e74c3c';
            break;
        default:
            statusBadge.style.background = '#95a5a6';
    }
    
    showNotification('Appointment status updated', 'success');
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for global use
window.NailArtStudio = {
    showNotification,
    setupAppointmentBooking,
    setupDashboard,
    validateForm,
    debounce,
    throttle
};
