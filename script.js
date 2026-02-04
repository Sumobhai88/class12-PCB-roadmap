// State Management
let completedDays = new Set();
let currentStreak = 0;

// Load saved progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('roadmapProgress');
    if (saved) {
        completedDays = new Set(JSON.parse(saved));
        updateAllDayCards();
        updateProgress();
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('roadmapProgress', JSON.stringify([...completedDays]));
}

// Update progress statistics
function updateProgress() {
    const totalDays = 150;
    const completed = completedDays.size;
    const remaining = totalDays - completed;
    const percentage = (completed / totalDays) * 100;

    // Update progress bar
    const progressBar = document.getElementById('overallProgress');
    progressBar.style.width = percentage + '%';

    // Update text displays
    document.getElementById('progressText').textContent = `${completed}/${totalDays} Days`;
    document.getElementById('completedDays').textContent = completed;
    document.getElementById('remainingDays').textContent = remaining;

    // Calculate streak
    calculateStreak();
    document.getElementById('currentStreak').textContent = currentStreak;

    // Celebrate completion
    if (completed === totalDays) {
        celebrateCompletion();
    }
}

// Calculate current streak
function calculateStreak() {
    if (completedDays.size === 0) {
        currentStreak = 0;
        return;
    }

    const sortedDays = [...completedDays].sort((a, b) => a - b);
    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
        if (sortedDays[i] === sortedDays[i - 1] + 1) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else {
            streak = 1;
        }
    }

    currentStreak = maxStreak;
}

// Update all day cards based on completed state
function updateAllDayCards() {
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        const dayNum = parseInt(card.getAttribute('data-day'));
        if (completedDays.has(dayNum)) {
            card.classList.add('completed');
            const btn = card.querySelector('.complete-btn');
            btn.textContent = 'Completed ✓';
        }
    });
}

// Toggle day completion
function toggleDayCompletion(dayNumber) {
    if (completedDays.has(dayNumber)) {
        completedDays.delete(dayNumber);
    } else {
        completedDays.add(dayNumber);
    }
    saveProgress();
    updateProgress();
}

// Month Navigation
function setupMonthNavigation() {
    const monthBtns = document.querySelectorAll('.month-btn');
    const monthSections = document.querySelectorAll('.month-section');

    monthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const monthNum = btn.getAttribute('data-month');

            // Update active button
            monthBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update visible section
            monthSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('data-month') === monthNum) {
                    section.classList.add('active');
                }
            });

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Setup complete buttons
function setupCompleteButtons() {
    const dayCards = document.querySelectorAll('.day-card');

    dayCards.forEach(card => {
        const btn = card.querySelector('.complete-btn');
        const dayNum = parseInt(card.getAttribute('data-day'));

        btn.addEventListener('click', () => {
            card.classList.toggle('completed');
            toggleDayCompletion(dayNum);

            if (card.classList.contains('completed')) {
                btn.textContent = 'Completed ✓';
                animateCardCompletion(card);
            } else {
                btn.textContent = 'Mark Complete';
            }
        });
    });
}

// Animate card on completion
function animateCardCompletion(card) {
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = '';
    }, 300);

    // Create confetti effect
    createConfetti(card);
}

// Simple confetti effect
function createConfetti(element) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const rect = element.getBoundingClientRect();

    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = rect.left + rect.width / 2 + 'px';
        confetti.style.top = rect.top + rect.height / 2 + 'px';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.transition = 'all 1s ease-out';

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        setTimeout(() => {
            confetti.style.transform = `translate(${tx}px, ${ty}px)`;
            confetti.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }
}

// Celebrate full completion
function celebrateCompletion() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0, 0, 0, 0.9)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    modal.style.animation = 'fadeIn 0.5s ease';

    modal.innerHTML = `
        <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 20px; max-width: 500px;">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">🎉 Congratulations! 🎉</h1>
            <p style="font-size: 1.5rem; margin-bottom: 20px;">You've completed all 150 days!</p>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">Your dedication is amazing! You're ready for your exams! 🚀</p>
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 15px 40px; font-size: 1.2rem; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Create massive confetti
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10001';
            confetti.style.transition = 'all 3s ease-in';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '120%';
                confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
            }, 10);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        completedDays.clear();
        localStorage.removeItem('roadmapProgress');

        // Reset all day cards
        const dayCards = document.querySelectorAll('.day-card');
        dayCards.forEach(card => {
            card.classList.remove('completed');
            const btn = card.querySelector('.complete-btn');
            btn.textContent = 'Mark Complete';
        });

        updateProgress();
        alert('Progress has been reset!');
    }
}

// Export progress as JSON
function exportProgressJSON() {
    const data = {
        completedDays: [...completedDays],
        totalDays: 150,
        completedCount: completedDays.size,
        remainingCount: 150 - completedDays.size,
        percentage: ((completedDays.size / 150) * 100).toFixed(2) + '%',
        streak: currentStreak,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    alert('JSON Progress exported successfully!');
}

// Export comprehensive PDF report
async function exportProgressPDF() {
    try {
        const { jsPDF } = window.jspdf;
        
        if (!jsPDF) {
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }

        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:white;padding:30px 50px;border-radius:15px;z-index:99999;font-size:18px;text-align:center;';
        loadingMsg.innerHTML = 'Generating PDF Report...<br><small>Please wait</small>';
        document.body.appendChild(loadingMsg);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = 20;

        // Helper function to add new page if needed
        const checkPageBreak = (requiredSpace = 20) => {
            if (yPos + requiredSpace > pageHeight - 25) {
                pdf.addPage();
                yPos = 20;
                return true;
            }
            return false;
        };

        // Add page numbers
        const addPageNumber = () => {
            const pageCount = pdf.internal.getNumberOfPages();
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Page ${pageCount}`, pageWidth - 30, pageHeight - 10);
        };

        // ===== PAGE 1: TITLE & OVERVIEW =====
        // Header background
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        
        // Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Class 12th Study Roadmap', pageWidth / 2, 18, { align: 'center' });
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text('150 Days Progress Report - CBSE/Bihar Board', pageWidth / 2, 28, { align: 'center' });
        
        pdf.setFontSize(11);
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        pdf.text(`Generated on: ${dateStr}`, pageWidth / 2, 38, { align: 'center' });
        
        yPos = 60;

        // Overall Statistics Section
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('OVERALL STATISTICS', margin, yPos);
        yPos += 3;
        
        // Underline
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 80, yPos);
        yPos += 12;

        const completed = completedDays.size;
        const remaining = 150 - completed;
        const percentage = ((completed / 150) * 100).toFixed(1);

        // Progress bar
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Overall Progress:', margin, yPos);
        yPos += 8;
        
        const barWidth = pageWidth - (2 * margin);
        const barHeight = 12;
        
        // Progress bar background
        pdf.setFillColor(230, 230, 230);
        pdf.roundedRect(margin, yPos, barWidth, barHeight, 3, 3, 'F');
        
        // Progress bar fill
        if (percentage > 0) {
            pdf.setFillColor(16, 185, 129);
            pdf.roundedRect(margin, yPos, (barWidth * percentage / 100), barHeight, 3, 3, 'F');
        }
        
        // Progress percentage text
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        if (percentage > 10) {
            pdf.text(`${percentage}%`, margin + (barWidth * percentage / 100) - 12, yPos + 8.5);
        } else {
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${percentage}%`, margin + (barWidth * percentage / 100) + 5, yPos + 8.5);
        }
        
        yPos += 20;

        // Statistics grid
        const stats = [
            { label: 'Total Days', value: '150', color: [59, 130, 246], icon: 'TOTAL' },
            { label: 'Completed', value: completed.toString(), color: [16, 185, 129], icon: 'DONE' },
            { label: 'Remaining', value: remaining.toString(), color: [239, 68, 68], icon: 'TODO' },
            { label: 'Streak', value: currentStreak.toString(), color: [245, 158, 11], icon: 'FIRE' }
        ];

        const boxWidth = (pageWidth - (2 * margin) - 9) / 4; // 3px gap between boxes
        stats.forEach((stat, index) => {
            const xPos = margin + (index * (boxWidth + 3));
            
            // Box shadow effect
            pdf.setFillColor(200, 200, 200);
            pdf.roundedRect(xPos + 1, yPos + 1, boxWidth, 28, 3, 3, 'F');
            
            // Main box
            pdf.setFillColor(...stat.color);
            pdf.roundedRect(xPos, yPos, boxWidth, 28, 3, 3, 'F');
            
            // Icon box
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(xPos + 2, yPos + 2, boxWidth - 4, 10, 2, 2, 'F');
            
            // Icon text
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text(stat.icon, xPos + boxWidth / 2, yPos + 8, { align: 'center' });
            
            // Value
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(stat.value, xPos + boxWidth / 2, yPos + 19, { align: 'center' });
            
            // Label
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(stat.label, xPos + boxWidth / 2, yPos + 25, { align: 'center' });
        });

        yPos += 38;

        // Performance indicator
        let performanceText = '';
        let performanceColor = [0, 0, 0];
        
        if (percentage < 20) {
            performanceText = 'Just Started - Keep going!';
            performanceColor = [239, 68, 68];
        } else if (percentage < 40) {
            performanceText = 'Making Progress - Stay consistent!';
            performanceColor = [245, 158, 11];
        } else if (percentage < 60) {
            performanceText = 'Good Progress - Halfway there!';
            performanceColor = [59, 130, 246];
        } else if (percentage < 80) {
            performanceText = 'Excellent Work - Keep pushing!';
            performanceColor = [139, 92, 246];
        } else if (percentage < 100) {
            performanceText = 'Outstanding! Almost done!';
            performanceColor = [16, 185, 129];
        } else {
            performanceText = 'COMPLETED! Congratulations!';
            performanceColor = [16, 185, 129];
        }

        pdf.setFillColor(...performanceColor.map(c => Math.min(255, c + 200)));
        pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 12, 3, 3, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...performanceColor);
        pdf.text(performanceText, pageWidth / 2, yPos + 8, { align: 'center' });
        
        yPos += 20;

        // ===== SUBJECT-WISE ANALYSIS =====
        checkPageBreak(50);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SUBJECT-WISE ANALYSIS', margin, yPos);
        yPos += 3;
        
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 90, yPos);
        yPos += 12;

        // Define subject days mapping
        const subjects = {
            'Physics': { 
                days: [1,2,3,4,5,15,16,17,18,19,31,32,33,34,39,40,41,42,47,48,51,52,53,54,55], 
                color: [59, 130, 246],
                topics: 'Electrostatics, Current, Magnetism, EM Induction, Waves, Optics'
            },
            'Chemistry': { 
                days: [6,7,8,9,20,21,22,23,24,35,36,37,38,43,44,45,46,49,50,56,57,58,59], 
                color: [139, 92, 246],
                topics: 'Solid State, Solutions, Electrochemistry, Kinetics, Surface Chemistry'
            },
            'Biology': { 
                days: [10,11,12,13,14,25,26,27,28,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81], 
                color: [16, 185, 129],
                topics: 'Reproduction, Genetics, Evolution, Biotechnology, Ecology'
            },
            'English': { 
                days: [82,83,84,85,86,87,88,89,90], 
                color: [245, 158, 11],
                topics: 'Prose, Poetry, Novel, Grammar, Writing Skills'
            },
            'Hindi': { 
                days: [91,92,93,94,95,96,97,98,99,100], 
                color: [239, 68, 68],
                topics: 'Gadya, Padya, Pratipurti, Vyakaran'
            },
            'Revision & Tests': { 
                days: [29,30,60,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150], 
                color: [99, 102, 241],
                topics: 'Full Revision, Mock Tests, PYQ Practice'
            }
        };

        // Display each subject
        Object.entries(subjects).forEach(([subjectName, subjectData]) => {
            checkPageBreak(22);
            
            const subjectDays = subjectData.days;
            const completedSubject = subjectDays.filter(d => completedDays.has(d)).length;
            const totalSubject = subjectDays.length;
            const subjectPercentage = totalSubject > 0 ? ((completedSubject / totalSubject) * 100).toFixed(1) : 0;

            // Subject box
            pdf.setFillColor(245, 245, 245);
            pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 18, 2, 2, 'F');
            
            // Subject name
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...subjectData.color);
            pdf.text(subjectName, margin + 3, yPos + 6);
            
            // Stats
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            pdf.text(`${completedSubject}/${totalSubject} days`, margin + 3, yPos + 11);
            
            // Topics
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            const topicsText = pdf.splitTextToSize(subjectData.topics, pageWidth - (2 * margin) - 80);
            pdf.text(topicsText, margin + 3, yPos + 15.5);
            
            // Progress percentage (right side)
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...subjectData.color);
            pdf.text(`${subjectPercentage}%`, pageWidth - margin - 25, yPos + 9, { align: 'right' });
            
            yPos += 20;
            
            // Progress bar
            const progressBarWidth = pageWidth - (2 * margin);
            const progressBarHeight = 5;
            
            // Background
            pdf.setFillColor(220, 220, 220);
            pdf.roundedRect(margin, yPos, progressBarWidth, progressBarHeight, 1, 1, 'F');
            
            // Fill
            if (subjectPercentage > 0) {
                pdf.setFillColor(...subjectData.color);
                pdf.roundedRect(margin, yPos, progressBarWidth * (subjectPercentage / 100), progressBarHeight, 1, 1, 'F');
            }
            
            yPos += 10;
        });

        yPos += 5;

        // ===== MONTHLY BREAKDOWN =====
        checkPageBreak(60);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MONTHLY BREAKDOWN', margin, yPos);
        yPos += 3;
        
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 85, yPos);
        yPos += 12;

        const months = [
            { name: 'Month 1', range: [1, 30], focus: 'Physics + Chemistry + Biology Basics', color: [59, 130, 246] },
            { name: 'Month 2', range: [31, 60], focus: 'Physics + Chemistry Main Chapters', color: [139, 92, 246] },
            { name: 'Month 3', range: [61, 90], focus: 'Biology + English', color: [16, 185, 129] },
            { name: 'Month 4', range: [91, 120], focus: 'Hindi + Full Revision PCB Start', color: [245, 158, 11] },
            { name: 'Month 5', range: [121, 150], focus: 'Final Revision + Tests + PYQ', color: [239, 68, 68] }
        ];

        months.forEach((month, idx) => {
            checkPageBreak(25);
            
            const monthDays = [];
            for (let i = month.range[0]; i <= month.range[1]; i++) {
                monthDays.push(i);
            }
            const completedMonth = monthDays.filter(d => completedDays.has(d)).length;
            const totalMonth = monthDays.length;
            const monthPercentage = ((completedMonth / totalMonth) * 100).toFixed(1);

            // Month card
            pdf.setFillColor(250, 250, 250);
            pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 20, 2, 2, 'F');
            
            // Month header with color bar
            pdf.setFillColor(...month.color);
            pdf.roundedRect(margin, yPos, 5, 20, 1, 1, 'F');
            
            // Month name
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${month.name} (Days ${month.range[0]}-${month.range[1]})`, margin + 8, yPos + 6);
            
            // Focus area
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            const focusText = pdf.splitTextToSize(month.focus, pageWidth - (2 * margin) - 60);
            pdf.text(focusText, margin + 8, yPos + 11);
            
            // Stats box (right side)
            const statsX = pageWidth - margin - 45;
            pdf.setFillColor(...month.color.map(c => Math.min(255, c + 200)));
            pdf.roundedRect(statsX, yPos + 2, 43, 16, 2, 2, 'F');
            
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...month.color);
            pdf.text(`${completedMonth}/${totalMonth}`, statsX + 21.5, yPos + 9, { align: 'center' });
            
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            pdf.text(`${monthPercentage}%`, statsX + 21.5, yPos + 15, { align: 'center' });
            
            yPos += 23;
        });

        // ===== NEW PAGE: COMPLETED DAYS =====
        pdf.addPage();
        addPageNumber();
        yPos = 20;
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('COMPLETED DAYS DETAIL', margin, yPos);
        yPos += 3;
        
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 100, yPos);
        yPos += 12;

        if (completedDays.size === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 40, 3, 3, 'F');
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            pdf.text('No days completed yet.', pageWidth / 2, yPos + 15, { align: 'center' });
            pdf.text('Start your journey today!', pageWidth / 2, yPos + 25, { align: 'center' });
            yPos += 45;
        } else {
            const sortedCompletedDays = [...completedDays].sort((a, b) => a - b);
            
            // Summary box
            pdf.setFillColor(220, 252, 231);
            pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 15, 2, 2, 'F');
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(16, 185, 129);
            pdf.text(`Total Completed: ${completedDays.size} days`, margin + 5, yPos + 6);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            pdf.text(`Streak: ${currentStreak} days`, margin + 5, yPos + 11);
            
            yPos += 20;
            
            // Grid of completed days
            const cols = 10;
            const boxSize = 15;
            const gap = 2;
            let col = 0;
            let row = 0;
            
            sortedCompletedDays.forEach((day) => {
                if (yPos + (row * (boxSize + gap)) + boxSize > pageHeight - 25) {
                    pdf.addPage();
                    addPageNumber();
                    yPos = 20;
                    row = 0;
                    col = 0;
                }
                
                const xPos = margin + (col * (boxSize + gap));
                const yBoxPos = yPos + (row * (boxSize + gap));
                
                // Box
                pdf.setFillColor(16, 185, 129);
                pdf.roundedRect(xPos, yBoxPos, boxSize, boxSize, 2, 2, 'F');
                
                // Day number
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text(day.toString(), xPos + boxSize / 2, yBoxPos + boxSize / 2 + 2, { align: 'center' });
                
                col++;
                if (col >= cols) {
                    col = 0;
                    row++;
                }
            });
            
            if (col > 0) row++; // Account for partial row
            yPos += (row * (boxSize + gap)) + 15;
        }

        // ===== RECOMMENDATIONS =====
        checkPageBreak(80);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RECOMMENDATIONS & NEXT STEPS', margin, yPos);
        yPos += 3;
        
        pdf.setDrawColor(245, 158, 11);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 130, yPos);
        yPos += 12;

        const recommendations = [];
        
        if (percentage < 20) {
            recommendations.push(
                { icon: 'TARGET', text: 'You are just getting started! Focus on building consistency.' },
                { icon: 'CHECK', text: 'Try to complete at least 2-3 days per week to build momentum.' },
                { icon: 'TIME', text: 'Set a specific study time each day to develop a habit.' },
                { icon: 'BOOK', text: 'Start with easier topics to build confidence.' }
            );
        } else if (percentage < 50) {
            recommendations.push(
                { icon: 'GOOD', text: 'Good progress! Keep maintaining your current pace.' },
                { icon: 'REVIEW', text: 'Make sure to review completed topics regularly.' },
                { icon: 'PRACTICE', text: 'Start attempting practice questions for covered chapters.' },
                { icon: 'NOTES', text: 'Create concise notes for quick revision.' }
            );
        } else if (percentage < 80) {
            recommendations.push(
                { icon: 'STAR', text: 'Excellent progress! You are more than halfway there!' },
                { icon: 'FOCUS', text: 'Focus on revision for completed chapters.' },
                { icon: 'TEST', text: 'Start solving previous year questions (PYQs).' },
                { icon: 'WRITE', text: 'Practice writing answers within time limits.' },
                { icon: 'WEAK', text: 'Identify and strengthen weak areas.' }
            );
        } else if (percentage < 100) {
            recommendations.push(
                { icon: 'ROCKET', text: 'Outstanding! You are in the final stretch!' },
                { icon: 'MOCK', text: 'Complete full-length mock tests regularly.' },
                { icon: 'REVISION', text: 'Focus on weak areas and quick revision.' },
                { icon: 'SPEED', text: 'Work on speed and accuracy.' },
                { icon: 'KEEP', text: 'Maintain your momentum till the end!' }
            );
        } else {
            recommendations.push(
                { icon: 'CONGRATS', text: 'Congratulations! You have completed the entire roadmap!' },
                { icon: 'REVISE', text: 'Focus on thorough revision of all topics.' },
                { icon: 'MOCK', text: 'Practice with full-length mock tests.' },
                { icon: 'STRATEGY', text: 'Polish your exam strategy and time management.' },
                { icon: 'CONFIDENT', text: 'Stay confident - you are fully prepared!' }
            );
        }

        recommendations.forEach((rec, index) => {
            checkPageBreak(12);
            
            // Recommendation box
            pdf.setFillColor(252, 246, 228);
            pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 10, 2, 2, 'F');
            
            // Icon circle
            pdf.setFillColor(245, 158, 11);
            pdf.circle(margin + 5, yPos + 5, 3, 'F');
            
            // Icon text
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text(rec.icon, margin + 5, yPos + 6, { align: 'center' });
            
            // Recommendation text
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            const recText = pdf.splitTextToSize(rec.text, pageWidth - (2 * margin) - 15);
            pdf.text(recText, margin + 10, yPos + 6);
            
            yPos += 12;
        });

        yPos += 5;

        // ===== STUDY TIPS =====
        checkPageBreak(60);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('STUDY TIPS FOR SUCCESS', margin, yPos);
        yPos += 3;
        
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPos, 95, yPos);
        yPos += 10;

        const tips = [
            'Make short notes for quick revision before exams',
            'Practice numerical problems daily for Physics and Chemistry',
            'Draw and label diagrams for Biology topics',
            'Time yourself while solving questions to improve speed',
            'Revise completed chapters at least once a week',
            'Get adequate sleep (7-8 hours) for better retention',
            'Solve previous year papers to understand exam patterns',
            'Join study groups for doubt clearing and motivation',
            'Take regular breaks during long study sessions',
            'Stay positive and maintain self-confidence'
        ];

        tips.forEach((tip, index) => {
            checkPageBreak(10);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            
            // Bullet point
            pdf.setFillColor(16, 185, 129);
            pdf.circle(margin + 2, yPos - 2, 1.5, 'F');
            
            const tipText = pdf.splitTextToSize(tip, pageWidth - (2 * margin) - 10);
            pdf.text(tipText, margin + 6, yPos);
            
            yPos += 7;
        });

        yPos += 10;

        // ===== FINAL PAGE - FOOTER & SUMMARY =====
        checkPageBreak(60);
        
        // Motivational Box
        pdf.setFillColor(230, 240, 250);
        pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 35, 3, 3, 'F');
        
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPos, pageWidth - (2 * margin), 35, 3, 3, 'D');
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(59, 130, 246);
        pdf.text('YOUR SUCCESS JOURNEY', pageWidth / 2, yPos + 8, { align: 'center' });
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text('Consistency > Intensity', pageWidth / 2, yPos + 16, { align: 'center' });
        pdf.text('Progress > Perfection', pageWidth / 2, yPos + 22, { align: 'center' });
        pdf.text('Learning > Marks', pageWidth / 2, yPos + 28, { align: 'center' });
        
        yPos += 45;
        
        // Final footer
        pdf.setFillColor(245, 245, 245);
        pdf.rect(0, pageHeight - 35, pageWidth, 35, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(59, 130, 246);
        pdf.text('Best of Luck for Your Board Exams!', pageWidth / 2, pageHeight - 22, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Stay focused, stay consistent, and success will follow!', pageWidth / 2, pageHeight - 15, { align: 'center' });
        
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generated by Class 12th Roadmap Tracker', pageWidth / 2, pageHeight - 8, { align: 'center' });

        // Add page numbers to all pages
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
        }

        // Save PDF
        const fileName = `Class12-Roadmap-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        
        // Remove loading message
        if (loadingMsg && loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
        }
        
        // Success message
        alert('PDF Report generated successfully!\n\nFile: ' + fileName);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again or check the console for details.');
        
        // Remove loading message if exists
        const loadingMsg = document.querySelector('[style*="position:fixed"]');
        if (loadingMsg && loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
        }
    }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + R to reset
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            resetProgress();
        }

        // Alt + E to export JSON
        if (e.altKey && e.key === 'e') {
            e.preventDefault();
            exportProgressJSON();
        }

        // Alt + P to export PDF
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            exportProgressPDF();
        }

        // Number keys 1-5 for month navigation
        if (e.key >= '1' && e.key <= '5') {
            const monthBtn = document.querySelector(`.month-btn[data-month="${e.key}"]`);
            if (monthBtn) monthBtn.click();
        }
    });
}

// Auto-save every 30 seconds
function setupAutoSave() {
    setInterval(() => {
        if (completedDays.size > 0) {
            saveProgress();
            console.log('Progress auto-saved');
        }
    }, 30000);
}

// Initialize the application
function init() {
    loadProgress();
    setupMonthNavigation();
    setupCompleteButtons();
    setupKeyboardShortcuts();
    setupAutoSave();

    // Setup action buttons
    document.getElementById('resetBtn').addEventListener('click', resetProgress);
    document.getElementById('exportJsonBtn').addEventListener('click', exportProgressJSON);
    document.getElementById('exportPdfBtn').addEventListener('click', exportProgressPDF);

    // Show welcome message for first-time users
    if (!localStorage.getItem('roadmapProgress')) {
        setTimeout(() => {
            alert('Welcome to your 150-Day Study Roadmap! 📚\n\nClick "Mark Complete" on each day as you finish it. Your progress is automatically saved!\n\nKeyboard Shortcuts:\n- Alt + R: Reset Progress\n- Alt + E: Export JSON\n- Alt + P: Export PDF Report\n- 1-5: Switch between months\n\nGood luck! 🚀');
        }, 1000);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
document.querySelectorAll(".resource-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        const link = this.getAttribute("data-link");
        window.open(link, "_blank");
    });
});

// Service Worker for offline support (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but app still works
        });
    });
}
