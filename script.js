document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');

    // Fade & Slide Text Effect (Korean & English)
    const typedElement = document.getElementById('typed-greeting');
    if (typedElement) {
        typedElement.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        typedElement.style.display = 'inline-block';
        
        const phrases = [
            '안녕하세요,<br><span>김유현</span> 입니다.',
            'Hello,<br>I am <span>Yuhyun Kim</span>.'
        ];
        let phraseIndex = 0;
        
        setInterval(() => {
            // Fade out and move down slightly
            typedElement.style.opacity = '0';
            typedElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Change text and Fade in
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typedElement.innerHTML = phrases[phraseIndex];
                
                typedElement.style.opacity = '1';
                typedElement.style.transform = 'translateY(0)';
            }, 500); // 0.5s matches the transition duration
            
        }, 3500); // Change text every 3.5 seconds
    }

    // Custom cursor movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to links
    const interactiveElements = document.querySelectorAll('a, button');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

window.copyEmail = function(btnElement) {
    const email = 'cool89kr@naver.com';
    navigator.clipboard.writeText(email).then(() => {
        const textSpan = btnElement.querySelector('.btn-text');
        const originalText = '이메일 주소 복사'; // Store the original text to prevent bug if clicked twice
        textSpan.innerText = '복사 완료! ✅';
        
        setTimeout(() => {
            textSpan.innerText = originalText;
        }, 2000);
    }).catch(err => {
        alert('이메일 주소 복사에 실패했습니다.수동으로 복사해주세요: ' + email);
    });
};

window.toggleDescription = function(btn) {
    const container = btn.closest('.description-container');
    const description = container.querySelector('.video-description');
    
    description.classList.toggle('expanded');
    
    if (description.classList.contains('expanded')) {
        btn.innerText = '접기 ▲';
    } else {
        btn.innerText = '더 보기 ▼';
    }
};
