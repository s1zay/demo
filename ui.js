// ui.js
// Handles all DOM interactions, element caching, and view state.

class UIController {
    constructor() {
        // Screens
        this.screenStart = document.getElementById('screen-start');
        this.screenResults = document.getElementById('screen-results');
        
        // Bottom Sheet & Modals
        this.bottomSheetOverlay = document.getElementById('bottom-sheet-overlay');
        this.guideModal = document.getElementById('guide-modal');
        
        // Buttons
        this.btnStart = document.getElementById('btn-start');
        this.btnCloseSheet = document.getElementById('btn-close-sheet');
        this.btnRestart = document.getElementById('btn-restart');
        
        // Guide Modal Buttons
        this.btnGuideOpen = document.getElementById('btn-guide-open');
        this.btnGuideClose = document.getElementById('btn-guide-close');
        
        // Output Elements
        this.jsonOutput = document.getElementById('json-output');
        this.chartCanvas = document.getElementById('chart-canvas');
        
        // Stat Elements
        this.statCount = document.getElementById('stat-count');
        this.statRawSize = document.getElementById('stat-raw-size');
        this.statFpSize = document.getElementById('stat-fp-size');
        this.statReduction = document.getElementById('stat-reduction');

        // Bind internal modal logic
        this.btnGuideOpen.addEventListener('click', () => this.openGuide());
        this.btnGuideClose.addEventListener('click', () => this.closeGuide());
    }

    // View Transitions
    openBottomSheet() {
        this.bottomSheetOverlay.classList.add('open');
    }

    closeBottomSheet() {
        this.bottomSheetOverlay.classList.remove('open');
    }

    openGuide() {
        this.guideModal.classList.remove('hidden');
        // Slight delay to allow CSS display transition before applying open class for animation
        setTimeout(() => this.guideModal.classList.add('open'), 10);
    }

    closeGuide() {
        this.guideModal.classList.remove('open');
        setTimeout(() => this.guideModal.classList.add('hidden'), 400); // Wait for transition
    }

    showResults() {
        this.screenStart.classList.remove('active');
        this.screenResults.classList.add('active');
    }

    resetToStart() {
        this.screenResults.classList.remove('active');
        this.screenStart.classList.add('active');
    }

    // Event Listeners Registration (for app.js)
    onStart(callback) {
        this.btnStart.addEventListener('click', callback);
    }

    onStop(callback) {
        this.btnCloseSheet.addEventListener('click', callback);
    }

    onRestart(callback) {
        this.btnRestart.addEventListener('click', callback);
    }

    // Stats Updater
    updateStats(count, rawBytes, fpBytes) {
        this.statCount.textContent = count;
        this.statRawSize.textContent = this.formatBytes(rawBytes);
        this.statFpSize.textContent = this.formatBytes(fpBytes);
        
        if (rawBytes > 0) {
            const reduction = ((rawBytes - fpBytes) / rawBytes) * 100;
            this.statReduction.textContent = `${reduction.toFixed(1)}%`;
        } else {
            this.statReduction.textContent = '0%';
        }
    }

    // Formats HTML JSON Tree
    renderJSON(data) {
        this.jsonOutput.innerHTML = this._generateHTMLJSON(data);
    }

    // Private helpers
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    _generateHTMLJSON(obj) {
        let html = '<div>{</div>';
        const processObject = (o, depth) => {
            let res = '';
            const entries = Object.entries(o);
            
            entries.forEach(([key, val], index) => {
                const isLast = index === entries.length - 1;
                const comma = isLast ? '' : ',';
                
                res += `<div class="json-indent">`;
                res += `<span class="json-key">"${key}"</span>: `;
                
                if (typeof val === 'number') {
                    res += `<span class="json-num">${val}</span>${comma}`;
                } else if (typeof val === 'string') {
                    res += `<span class="json-str">"${val}"</span>${comma}`;
                } else if (typeof val === 'object' && val !== null) {
                    res += `{</div>`;
                    res += processObject(val, depth + 1);
                    res += `<div class="json-indent">}${comma}`;
                } else {
                    res += `${val}${comma}`;
                }
                res += `</div>`;
            });
            return res;
        };
        html += processObject(obj, 1);
        html += '<div>}</div>';
        return html;
    }
    }
