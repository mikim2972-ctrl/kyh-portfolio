document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');

    // --- Theme (Dark/Light Mode) Initialization & Controller ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // Hero Section Sequence Fade-in Animation
    const heroTitle = document.querySelector('.hero-content .title');
    const heroSubtitles = document.querySelectorAll('.hero-content .subtitle');

    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('animate');
        }, 100);
    }

    // 1. Fade & Slide Text Effect (Bilingual Toggle Coordination)
    const typedElement = document.getElementById('typed-greeting');
    const langBtns = document.querySelectorAll('.lang-btn');
    let rotationInterval = null;

    // 다국어 매핑 데이터
    const greetings = {
        ko: '안녕하세요,<br><span>김유현</span> 입니다.',
        en: 'Hello,<br>I am <span>Yuhyun Kim</span>.'
    };

    // --- Typing Effect Functions ---
    let typingTimer = null;

    function typeHTML(element, speed = 35) {
        // Stop any running typing timer
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }

        // Get or store original HTML content
        let rawHtml = element.getAttribute('data-raw-html');
        if (!rawHtml) {
            rawHtml = element.innerHTML.trim();
            element.setAttribute('data-raw-html', rawHtml);
        }

        // Add animate class to let CSS set opacity/transform
        element.classList.add('animate');
        element.innerHTML = '';

        // Create a blinking typing cursor
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        element.appendChild(cursorSpan);

        // Parse HTML into tags and text characters
        const tokens = [];
        let i = 0;
        while (i < rawHtml.length) {
            if (rawHtml[i] === '<') {
                let tag = '';
                while (i < rawHtml.length && rawHtml[i] !== '>') {
                    tag += rawHtml[i];
                    i++;
                }
                if (i < rawHtml.length) {
                    tag += '>';
                    i++;
                }
                tokens.push({ type: 'tag', value: tag });
            } else {
                tokens.push({ type: 'char', value: rawHtml[i] });
                i++;
            }
        }

        let tokenIndex = 0;

        function drawNext() {
            if (tokenIndex < tokens.length) {
                const token = tokens[tokenIndex];
                if (token.type === 'tag') {
                    cursorSpan.insertAdjacentHTML('beforebegin', token.value);
                } else {
                    cursorSpan.insertAdjacentText('beforebegin', token.value);
                }
                tokenIndex++;
                typingTimer = setTimeout(drawNext, speed);
            } else {
                // Remove cursor after compilation
                setTimeout(() => {
                    if (cursorSpan.parentNode === element) {
                        element.removeChild(cursorSpan);
                    }
                }, 1000);
            }
        }

        drawNext();
    }

    function resetSubtitle(element) {
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
        const rawHtml = element.getAttribute('data-raw-html');
        if (rawHtml) {
            element.innerHTML = rawHtml;
        }
    }

    function triggerSubtitle(lang) {
        const activeSub = document.querySelector(`.hero-content .subtitle.lang-${lang}`);
        const inactiveSub = document.querySelector(`.hero-content .subtitle.lang-${lang === 'ko' ? 'en' : 'ko'}`);
        
        if (inactiveSub) {
            resetSubtitle(inactiveSub);
        }
        if (activeSub) {
            typeHTML(activeSub, 35);
        }
    }

    function startLanguageRotation() {
        if (rotationInterval || localStorage.getItem('preferredLang')) return;

        if (typedElement) {
            typedElement.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
            typedElement.style.display = 'inline-block';

            rotationInterval = setInterval(() => {
                typedElement.style.opacity = '0';
                typedElement.style.transform = 'translateY(8px)';

                setTimeout(() => {
                    const nextLang = document.body.classList.contains('lang-en') ? 'ko' : 'en';
                    
                    document.body.classList.remove('lang-ko', 'lang-en');
                    document.body.classList.add('lang-' + nextLang);

                    typedElement.innerHTML = greetings[nextLang];

                    langBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.lang === nextLang);
                    });

                    typedElement.style.opacity = '1';
                    typedElement.style.transform = 'translateY(0)';

                    triggerSubtitle(nextLang);
                }, 1000);
            }, 5000); // 5s interval to allow reading and typing
        }
    }

    function stopLanguageRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    }

    // Custom cursor movement & Scroll hide logic
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (cursor) {
            cursor.classList.add('cursor-hidden');
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Keep hidden while stationary after scroll
        }, 100);
    });

    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.classList.remove('cursor-hidden');
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    // Add hover effect to links, buttons, and title greeting
    const interactiveElements = document.querySelectorAll('a, button, #typed-greeting, .scroll-progress-ticks .tick, .theme-toggle-btn, .tab-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('cursor-hover');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 언어 버튼 클릭 이벤트 및 수동 전환 처리
    if (langBtns.length) {
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                
                stopLanguageRotation();

                document.body.classList.remove('lang-ko', 'lang-en');
                document.body.classList.add('lang-' + lang);

                if (typedElement) {
                    typedElement.style.opacity = '0';
                    typedElement.style.transform = 'translateY(6px)';
                    typedElement.innerHTML = greetings[lang];
                    void typedElement.offsetWidth;
                    typedElement.style.opacity = '1';
                    typedElement.style.transform = 'translateY(0)';
                }

                langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

                localStorage.setItem('preferredLang', lang);

                triggerSubtitle(lang);
            });
        });
    }

    // 페이지 로드 시 선호 언어 적용 및 자동 회전 처리
    const saved = localStorage.getItem('preferredLang');
    if (saved) {
        document.body.classList.remove('lang-ko', 'lang-en');
        document.body.classList.add('lang-' + saved);
        
        if (typedElement) {
            typedElement.innerHTML = greetings[saved];
        }

        langBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.lang === saved);
        });

        setTimeout(() => {
            triggerSubtitle(saved);
        }, 1100);
    } else {
        if (typedElement) {
            typedElement.innerHTML = greetings.ko;
        }
        
        setTimeout(() => {
            triggerSubtitle('ko');
            startLanguageRotation();
        }, 1100);
    }

    // --- Scroll progress ticks indicator ---
    const scrollTicksContainer = document.getElementById('scroll-progress-ticks');
    if (scrollTicksContainer) {
        const ticks = scrollTicksContainer.querySelectorAll('.tick');
        
        function updateScrollTicks() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            
            const scrollPercent = window.scrollY / docHeight;
            const activeIndex = Math.min(9, Math.floor(scrollPercent * 10));
            
            ticks.forEach((tick, idx) => {
                if (idx === activeIndex) {
                    tick.classList.add('active');
                } else {
                    tick.classList.remove('active');
                }
            });
        }
        
        ticks.forEach((tick, idx) => {
            tick.addEventListener('click', () => {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const targetScroll = (idx / 9) * docHeight;
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            });
        });
        
        window.addEventListener('scroll', updateScrollTicks);
        window.addEventListener('resize', updateScrollTicks);
        updateScrollTicks(); // Initial call
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- About Me Tab System ---
    const tabBtns = document.querySelectorAll('.about-tabs-nav .tab-btn');
    const tabPanels = document.querySelectorAll('.tab-card-container .tab-panel');

    if (tabBtns.length && tabPanels.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Deactivate all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                // Hide all panels
                tabPanels.forEach(p => p.classList.remove('active'));

                // Activate clicked button
                btn.classList.add('active');

                // Activate corresponding panel
                const activePanel = document.getElementById(targetTab);
                if (activePanel) {
                    activePanel.classList.add('active');
                }
            });
        });
    }
});

window.toggleDescription = function (btn) {
    const container = btn.closest('.description-container');
    const descriptions = container.querySelectorAll('.video-description');

    descriptions.forEach(desc => desc.classList.toggle('expanded'));

    if (descriptions[0] && descriptions[0].classList.contains('expanded')) {
        btn.innerHTML = `<span class="lang-ko">접기 ▲</span><span class="lang-en">Close ▲</span>`;
    } else {
        btn.innerHTML = `<span class="lang-ko">더 보기 ▼</span><span class="lang-en">Read More ▼</span>`;
    }
};
