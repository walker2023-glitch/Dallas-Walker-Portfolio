// Data store holding real technical portfolio operations from resume
const projects = [
    {
        id: "factor",
        title: "FACTOR: AI Competency Analysis",
        tag: "STATS_ANOVA",
        shortDesc: "Rigorous statistical analysis evaluating systemic error rates across foundation LLMs using multi-way ANOVA.",
        longDesc: "Architected a multi-way ANOVA statistical profile to evaluate how shifting prompt variables alter LLM accuracy. Replaced subjective evaluation by structuring continuous response datasets blocked by academic discipline to extract empirical deployment insights.",
        image: "images/F.A.C.T.O.R.png",
        icon: "query_stats",
        repoAvailable: true
    },
    {
        id: "n-sight",
        title: "N-sight: Supply Chain Tracking",
        tag: "FULL_STACK",
        shortDesc: "Award-winning full-stack web utility built to map and verify nitrogen allocation data for global agriculture.",
        longDesc: "Co-engineered an agricultural data pipeline designed to securely track nitrogen pools from localized farm soil to grocery shelves. Features a responsive adaptive interface with dark/light variants and a multi-language translation engine. Awarded 'Most Deployable Application' by hackathon panel judges.",
        image: "images/N-sight Logo.jpg",
        icon: "lan",
        repoAvailable: true
    },
    {
        id: "star-identifier",
        title: "Star Identifier Pipeline",
        tag: "ML_DOTNET",
        shortDesc: "Astrophysical classification architecture built in C# using ML.NET to sort stellar profiles.",
        longDesc: "Engineered a hybrid classification system that unifies traditional physical rules with machine learning pipelines to predict star designations. Formulated custom preprocessing queries to filter, clean, and normalize raw physical attribute matrices for stable hardware performance.",
        image: "images/Star ML.png",
        icon: "blur_on",
        repoAvailable: true
    },
    {
        id: "freezer-penguin",
        title: "Freezer Penguin",
        tag: "DATABASE_INFRA",
        shortDesc: "Standardized relational inventory application pairing a remote MySQL backend with a dynamic UI.",
        longDesc: "Transformed a fragmented hackathon interface script into a production-grade relational MySQL storage application over a full academic semester. Integrated clean backend querying and dynamic state tracking using modern AI workflows.",
        image: "images/FPappIcon.jpg",
        icon: "database",
        repoAvailable: false
    },
    {
        id: "wingman",
        title: "Wingman Logistics Engine",
        tag: "CLOUD_API",
        shortDesc: "Event logistics and planning application featuring secure cloud hosting pipelines on AWS.",
        longDesc: "Co-developed an architectural dating app optimized for regional activity and venue coordination. Integrated a native generative Gemini API module to help users instantly construct invitation texts, minimizing communication friction. Successfully scaled and migrated from raw local prototype to active AWS cloud infrastructure.",
        image: "images/Wingman.png",
        icon: "terminal",
        repoAvailable: true
    },
    {
        id: "proxmox-homelab",
        title: "Proxmox Home Server Lab",
        tag: "DEVOPS_LXC",
        shortDesc: "Private cloud virtualization platform optimized for hosting containerized applications.",
        longDesc: "Built a localized, highly reliable computing environment utilizing a physical enterprise Dell PowerEdge node. Administered bare-metal Proxmox VE hypervisors, secure unprivileged LXC microservices, ZFS data redundancy arrays, Docker containers, and Tailscale mesh configurations.",
        image: "images/Proxmox.png",
        icon: "memory",
        repoAvailable: false
    }
];

// Function 1: Render out all project objects and compute lengths dynamically
function populateProjectsGrid() {
    const gridContainer = document.querySelector('.projects-grid');
    const countBadge = document.querySelector('.count-badge');
    
    if(!gridContainer) return;
    gridContainer.innerHTML = '';


    //I did use AI for this part
    // Dynamically update your project metric counter using the .length attribute
    if (countBadge) {
        // Formats length neatly to match your terminal aesthetic (e.g., "COUNT: 006")
        countBadge.innerText = `COUNT: ${String(projects.length).padStart(3, '0')}`;
    }
    //end of AI assisted part

    projects.forEach(project => {
        const cardHTML = `
        <article class="project-card" data-id="${project.id}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <span class="tag">${project.tag}</span>
            </div>
            <div class="project-info">
                <h4>${project.title}</h4>
                <p>${project.shortDesc}</p>
                <div class="project-links">
                    <div class="icons">
                        <span class="material-symbols-outlined">${project.icon}</span>
                    </div>
                    <a href="#" class="details-trigger">VIEW_SPEC -></a>
                </div>
            </div>
        </article>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}
         
// Function 2: Repaired with safe error guards
function setupModalInteractions() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const actionArea = document.getElementById('modal-action-area');
    
    // Safety check: Exit immediately if the modal wrapper HTML structure is missing
    if (!modal) return;

    document.querySelectorAll('.project-card').forEach(card => {
        const trigger = card.querySelector('.details-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = card.getAttribute('data-id');
            const targetProject = projects.find(p => p.id === projectId);

            if (targetProject) {
                // Safeguard content assignments
                if (modalTitle) modalTitle.innerText = targetProject.title;
                if (modalBody) modalBody.innerText = targetProject.longDesc;
                
                if (actionArea) {
                    if (targetProject.repoAvailable) {
                        actionArea.innerHTML = `<button class="btn-primary">ACCESS_SECURE_REPOSITORY</button>`;
                    } else {
                        actionArea.innerHTML = `<p class="status-indicator" style="color: var(--text-muted)">[REPO_STATUS: CLASSIFIED_INTERNAL]</p>`;
                    }
                }

                modal.style.display = 'flex';
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}
// Master execution context when HTML layout settles down
document.addEventListener('DOMContentLoaded', () => {
    // Populate layout
    populateProjectsGrid();
    setupModalInteractions();
    

    //AI did these chatbot features, will hook it up to API in the future.
    // Select DOM Elements for Simulated AI Chatbot
    const input = document.getElementById('ai-input');
    const output = document.getElementById('chat-output');
    const button = document.getElementById('execute-btn');
    const suggestedBtns = document.querySelectorAll('.query-btn');

    const simulateResponse = (text) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message';
        userDiv.innerHTML = `<span class="usr-tag">[USR]:</span><span>${text}</span>`;
        output.appendChild(userDiv);
        output.scrollTop = output.scrollHeight;

        setTimeout(() => {
            const sysDiv = document.createElement('div');
            sysDiv.className = 'chat-message';
            sysDiv.innerHTML = `<span class="sys-tag">[SYS]:</span><span>Querying archive for "${text.substring(0, 15)}...". Analysis indicates high competency in low-level systems and advanced statistics. Detailed module data available on request.</span>`;
            
            output.appendChild(sysDiv);
            output.scrollTop = output.scrollHeight;
        }, 800);
    };

    if(button && input) {
        button.addEventListener('click', () => {
            if (input.value.trim() !== '') {
                simulateResponse(input.value);
                input.value = '';
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                simulateResponse(input.value);
                input.value = '';
            }
        });
    }

    suggestedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let text = e.target.innerText.replace(/"/g, ''); 
            simulateResponse(text);
        });
    });
});
