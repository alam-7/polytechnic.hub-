// ========================================
// ALPHA WAVE DIPLOMA HUB - MAIN APP
// All interactive features
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 1. NAVBAR
    // ========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // 2. MOBILE MENU
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            this.innerHTML = navLinks.classList.contains('open') ? '✕' : '☰';
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            if (mobileToggle) mobileToggle.innerHTML = '☰';
        });
    });

    // ========================================
    // 3. LOAD FEATURE CARDS (Homepage)
    // ========================================
    const featureGrid = document.getElementById('featureGrid');
    if (featureGrid) {
        const features = [
            { icon: '📚', title: 'Syllabus', desc: 'K-Scheme syllabus for all branches & semesters', link: 'syllabus.html', color: 'cyan' },
            { icon: '🔬', title: 'Lab Manuals', desc: 'Practical guides and experiment manuals', link: 'manuals.html', color: 'pink' },
            { icon: '📝', title: 'Question Papers', desc: 'Previous year papers with solutions', link: 'papers.html', color: 'gold' },
            { icon: '🎥', title: 'Video Lectures', desc: 'Curated YouTube playlists for each subject', link: 'resources.html', color: 'purple' }
        ];

        featureGrid.innerHTML = features.map(f => `
            <div class="card card-glow-${f.color}" onclick="location.href='${f.link}'">
                <div class="icon">${f.icon}</div>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
                <span class="arrow">Explore →</span>
            </div>
        `).join('');
    }

    // ========================================
    // 4. LOAD BRANCH CARDS (Homepage)
    // ========================================
    const branchGrid = document.getElementById('branchGrid');
    if (branchGrid && typeof MSBTEData !== 'undefined') {
        branchGrid.innerHTML = MSBTEData.branches.map(b => `
            <div class="card" onclick="location.href='branches/${b.id}.html'">
                <div class="icon">${b.icon}</div>
                <h3>${b.name}</h3>
                <p>View syllabus, manuals & papers</p>
                <span class="arrow">View →</span>
            </div>
        `).join('');
    }

    // ========================================
    // 5. LOAD SYLLABUS
    // ========================================
    const syllabusList = document.getElementById('syllabusList');
    if (syllabusList && typeof MSBTEData !== 'undefined') {
        renderSyllabus('all');
        
        // Branch filter for syllabus
        document.querySelectorAll('#branchFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                document.querySelectorAll('#branchFilters .filter-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderSyllabus(this.dataset.branch);
            });
        });

        // Search for syllabus
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const activeBranch = document.querySelector('#branchFilters .filter-tag.active');
                renderSyllabus(activeBranch ? activeBranch.dataset.branch : 'all', this.value.toLowerCase());
            });
        }
    }

    function renderSyllabus(branch, query = '') {
        const container = document.getElementById('syllabusList');
        if (!container) return;

        let items = [];
        const data = MSBTEData.syllabus;

        if (branch === 'all') {
            for (const [b, semesters] of Object.entries(data)) {
                for (const [sem, subjects] of Object.entries(semesters)) {
                    subjects.forEach(s => {
                        items.push({
                            branch: b,
                            semester: sem.replace('semester', 'Sem '),
                            ...s
                        });
                    });
                }
            }
        } else if (data[branch]) {
            for (const [sem, subjects] of Object.entries(data[branch])) {
                subjects.forEach(s => {
                    items.push({
                        branch: branch,
                        semester: sem.replace('semester', 'Sem '),
                        ...s
                    });
                });
            }
        }

        // Filter by search query
        if (query) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.code.toLowerCase().includes(query) ||
                item.branch.toLowerCase().includes(query)
            );
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <p>No results found. Try a different search.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="resource-item" data-branch="${item.branch}">
                <div class="info">
                    <span class="title">${item.name}</span>
                    <span class="meta">${item.code} · ${item.branch} · ${item.semester}</span>
                </div>
                <span class="badge badge-cyan">${item.semester}</span>
            </div>
        `).join('');
    }

    // ========================================
    // 6. LOAD MANUALS
    // ========================================
    const manualsList = document.getElementById('manualsList');
    if (manualsList && typeof MSBTEData !== 'undefined') {
        renderManuals('all');

        document.querySelectorAll('#branchFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                document.querySelectorAll('#branchFilters .filter-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderManuals(this.dataset.branch);
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const activeBranch = document.querySelector('#branchFilters .filter-tag.active');
                renderManuals(activeBranch ? activeBranch.dataset.branch : 'all', this.value.toLowerCase());
            });
        }
    }

    function renderManuals(branch, query = '') {
        const container = document.getElementById('manualsList');
        if (!container) return;

        let items = [];
        const data = MSBTEData.manuals;

        if (branch === 'all') {
            for (const [b, manuals] of Object.entries(data)) {
                manuals.forEach(m => {
                    items.push({ branch: b, ...m });
                });
            }
        } else if (data[branch]) {
            data[branch].forEach(m => {
                items.push({ branch: branch, ...m });
            });
        }

        if (query) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.branch.toLowerCase().includes(query)
            );
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔬</div>
                    <p>No manuals found for this branch.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="resource-item" data-branch="${item.branch}">
                <div class="info">
                    <span class="title">${item.name}</span>
                    <span class="meta">${item.code || ''} · ${item.branch}</span>
                </div>
                <a href="${item.link || '#'}" class="link-btn" target="_blank">View →</a>
            </div>
        `).join('');
    }

    // ========================================
    // 7. LOAD PAPERS
    // ========================================
    const papersList = document.getElementById('papersList');
    if (papersList && typeof MSBTEData !== 'undefined') {
        renderPapers('all');

        document.querySelectorAll('#branchFilters .filter-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                document.querySelectorAll('#branchFilters .filter-tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderPapers(this.dataset.branch);
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const activeBranch = document.querySelector('#branchFilters .filter-tag.active');
                renderPapers(activeBranch ? activeBranch.dataset.branch : 'all', this.value.toLowerCase());
            });
        }
    }

    function renderPapers(branch, query = '') {
        const container = document.getElementById('papersList');
        if (!container) return;

        let items = [];
        const data = MSBTEData.papers;

        if (branch === 'all') {
            for (const [b, years] of Object.entries(data)) {
                for (const [year, subjects] of Object.entries(years)) {
                    subjects.forEach(s => {
                        items.push({ branch: b, year: year, ...s });
                    });
                }
            }
        } else if (data[branch]) {
            for (const [year, subjects] of Object.entries(data[branch])) {
                subjects.forEach(s => {
                    items.push({ branch: branch, year: year, ...s });
                });
            }
        }

        if (query) {
            items = items.filter(item => 
                item.subject.toLowerCase().includes(query) || 
                item.branch.toLowerCase().includes(query) ||
                item.year.includes(query)
            );
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                    <p>No papers found. Try a different search.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="resource-item" data-branch="${item.branch}">
                <div class="info">
                    <span class="title">${item.subject}</span>
                    <span class="meta">${item.branch} · ${item.year}</span>
                </div>
                <a href="${item.link || '#'}" class="link-btn" target="_blank">Download →</a>
            </div>
        `).join('');
    }

    // ========================================
    // 8. LOAD VIDEO RESOURCES
    // ========================================
    const resourcesList = document.getElementById('resourcesList');
    if (resourcesList && typeof MSBTEData !== 'undefined') {
        const videos = MSBTEData.videos || [];
        const searchInput = document.getElementById('searchInput');

        renderVideos(videos);

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const filtered = videos.filter(v => 
                    v.title.toLowerCase().includes(query) || 
                    v.channel.toLowerCase().includes(query)
                );
                renderVideos(filtered);
            });
        }
    }

    function renderVideos(videos) {
        const container = document.getElementById('resourcesList');
        if (!container) return;

        if (videos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎥</div>
                    <p>No videos found. Try a different search.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = videos.map(v => `
            <div class="resource-item">
                <div class="info">
                    <span class="title">${v.title}</span>
                    <span class="meta">📺 ${v.channel}</span>
                </div>
                <a href="${v.link || '#'}" class="link-btn" target="_blank">Watch →</a>
            </div>
        `).join('');
    }

}); //