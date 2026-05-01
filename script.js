document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stats counter, trigger animation
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Animated Counter ---
    function animateCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps approx
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                // Format with k if > 1000 for aesthetics, but actual target here is 10000
                if(target >= 10000) {
                    counterElement.innerText = Math.ceil(current / 1000) + 'k';
                } else {
                    counterElement.innerText = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if(target >= 10000) {
                    counterElement.innerText = '10k';
                } else {
                    counterElement.innerText = target;
                }
            }
        };
        
        updateCounter();
    }

    // --- Mouse Move Parallax (Interactive Cards & Hero) ---
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max rotation 5deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; // reset
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // remove transition for smooth tracking
        });
    });

    // --- Demo Interactive State (Placeholder logic) ---
    const demoPlaceholder = document.getElementById('demoPlaceholder');
    if (demoPlaceholder) {
        demoPlaceholder.addEventListener('click', function() {
            const overlay = this.querySelector('.demo-overlay');
            if(overlay) {
                overlay.innerHTML = '<div class="loading-spinner" style="color:var(--clr-accent-cyan); font-size: 2rem;"><i class="ph-bold ph-spinner ph-spin"></i></div><h3 style="margin-top:1rem;">Loading 8K Tour...</h3>';
                setTimeout(() => {
                    overlay.innerHTML = '<h3>Interactive Tour Loaded</h3><p>(This is a simulation. Embed Kuula iframe here.)</p>';
                    overlay.style.background = 'rgba(4,9,20, 0.8)';
                }, 1500);
            }
        });
    }

    // --- Form Submission Handling ---
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('i');
            const originalText = btnText.innerText;
            
            // Loading State
            btnText.innerText = 'Sending...';
            btnIcon.className = 'ph-bold ph-spinner ph-spin';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';

            // Get Form Data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const location = document.getElementById('location').value;
            const packageSelect = document.getElementById('packageSelect');
            const hostingSelect = document.getElementById('formHostingSelect');
            
            const pkg = packageSelect.options[packageSelect.selectedIndex].text;
            const hosting = hostingSelect.options[hostingSelect.selectedIndex].text;

            // Construct WhatsApp Message
            const waNumber = "8801325886050";
            let message = `*New Booking Request - PropScan 360*\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Location:* ${location}\n`;
            message += `*Package:* ${pkg}\n`;
            message += `*Hosting:* ${hosting}\n\n`;
            message += `Please contact me to confirm the shoot!`;
            
            const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // Simulate slight processing delay for UX, then redirect
            setTimeout(() => {
                // Open WhatsApp in new tab
                window.open(waURL, '_blank');

                // Success State on UI
                btnText.innerText = 'Redirecting to WhatsApp...';
                btnIcon.className = 'ph-bold ph-whatsapp-logo';
                submitBtn.style.backgroundColor = 'var(--clr-whatsapp)';
                submitBtn.style.color = '#fff';
                submitBtn.style.opacity = '1';
                submitBtn.style.boxShadow = '0 0 20px rgba(37, 211, 102, 0.5)';
                
                // Reset to Original State after a few seconds
                setTimeout(() => {
                    bookingForm.reset();
                    btnText.innerText = originalText;
                    btnIcon.className = 'ph-bold ph-paper-plane-tilt';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.boxShadow = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 800);
        });
    }

    // --- Dynamic Hosting Decoupling UX ---
    window.updateDynamicPricing = function(packageType, basePrice) {
        const selectEl = document.getElementById(packageType + '-hosting');
        const priceEl = document.getElementById(packageType + '-price');
        const monthlyTag = document.getElementById(packageType + '-monthly');
        
        if (!selectEl || !priceEl || !monthlyTag) return;
        
        const val = selectEl.value;
        
        if (val === 'subscription') {
            priceEl.innerText = basePrice.toLocaleString();
            monthlyTag.style.display = 'block';
        } else {
            const extra = parseInt(val) || 0;
            const newTotal = basePrice + extra;
            priceEl.innerText = newTotal.toLocaleString();
            monthlyTag.style.display = 'none';
        }
    };

    // Global function to handle "Book" button clicks on cards
    window.selectPackage = function(pkgName) {
        const packageSelect = document.getElementById('packageSelect');
        const formHostingSelect = document.getElementById('formHostingSelect');
        
        if (packageSelect) {
            packageSelect.value = pkgName;
            packageSelect.style.borderBottomColor = 'var(--clr-accent-cyan)';
            setTimeout(() => {
                packageSelect.style.borderBottomColor = '';
            }, 1000);
        }
        
        // Sync the hosting selection if applicable
        if (pkgName === 'standard' || pkgName === 'premium') {
            const cardSelect = document.getElementById(pkgName + '-hosting');
            if (cardSelect && formHostingSelect) {
                formHostingSelect.value = cardSelect.value;
                formHostingSelect.style.borderBottomColor = 'var(--clr-accent-cyan)';
                setTimeout(() => {
                    formHostingSelect.style.borderBottomColor = '';
                }, 1000);
            }
        }
    };
});
