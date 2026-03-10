// js/roster.js

// Mock player data for demonstration
// The actual RATS roster would be populated here or fetched from an API
const rosterData = [
    // Leadership
    { callsign: "GHOST", role: "CLAN LEADER", hours: "3500", since: "2019" },
    { callsign: "REAPER", role: "CO-LEADER", hours: "3100", since: "2019" },
    
    // Squad Leads
    { callsign: "VIPER", role: "SQUAD LEAD", hours: "2400", since: "2020" },
    { callsign: "TITAN", role: "SQUAD LEAD", hours: "2150", since: "2020" },
    { callsign: "SHADOW", role: "SQUAD LEAD", hours: "1800", since: "2021" },
    { callsign: "RAVEN", role: "SQUAD LEAD", hours: "1650", since: "2021" },
    
    // Veterans
    { callsign: "BULLDOG", role: "VETERAN", hours: "1500", since: "2021" },
    { callsign: "STRIKER", role: "VETERAN", hours: "1420", since: "2021" },
    { callsign: "HUNTER", role: "VETERAN", hours: "1380", since: "2021" },
    { callsign: "SILVER", role: "VETERAN", hours: "1250", since: "2022" },
    { callsign: "APEX", role: "VETERAN", hours: "1100", since: "2022" },
    { callsign: "NOVA", role: "VETERAN", hours: "1050", since: "2022" },
    
    // Members
    { callsign: "COBALT", role: "MEMBER", hours: "900", since: "2022" },
    { callsign: "FROST", role: "MEMBER", hours: "850", since: "2022" },
    { callsign: "WOLF", role: "MEMBER", hours: "780", since: "2023" },
    { callsign: "ECHO", role: "MEMBER", hours: "720", since: "2023" },
    { callsign: "DELTA", role: "MEMBER", hours: "690", since: "2023" },
    { callsign: "SPARTAN", role: "MEMBER", hours: "640", since: "2023" },
    { callsign: "IRON", role: "MEMBER", hours: "580", since: "2023" },
    { callsign: "BRASS", role: "MEMBER", hours: "510", since: "2023" },
    { callsign: "STONE", role: "MEMBER", hours: "490", since: "2023" },
    { callsign: "BLAZE", role: "MEMBER", hours: "450", since: "2024" },
    { callsign: "DRIFT", role: "MEMBER", hours: "420", since: "2024" },
    { callsign: "FLINT", role: "MEMBER", hours: "380", since: "2024" },
    { callsign: "ROGUE", role: "MEMBER", hours: "350", since: "2024" },
    { callsign: "JESTER", role: "MEMBER", hours: "310", since: "2024" },
    { callsign: "CRASH", role: "MEMBER", hours: "280", since: "2024" },
    { callsign: "WIRE", role: "MEMBER", hours: "250", since: "2024" },
    
    // Recruits
    { callsign: "SPARK", role: "RECRUIT", hours: "150", since: "2024" },
    { callsign: "GRIT", role: "RECRUIT", hours: "120", since: "2024" },
    { callsign: "NANO", role: "RECRUIT", hours: "110", since: "2024" },
];

document.addEventListener('DOMContentLoaded', () => {
    const rosterGrid = document.getElementById('roster-grid');
    const searchInput = document.getElementById('roster-search');
    const noResults = document.getElementById('no-results');
    const totalCount = document.getElementById('total-count');

    // Function to generate the HTML for a single member card
    function createMemberCard(member) {
        return `
            <div class="roster-card fade-in">
                <div class="avatar-placeholder"><span class="watermark">RATS</span></div>
                <div class="role-tag">${member.role}</div>
                <h3 class="member-name">${member.callsign}</h3>
                <div class="member-stats">${member.hours}h &middot; Since ${member.since}</div>
            </div>
        `;
    }

    // Function to render the list of members
    function renderRoster(membersToRender) {
        if (!rosterGrid) return; // Exit if not on the roster page
        
        rosterGrid.innerHTML = ''; // Clear current grid
        
        if (membersToRender.length === 0) {
            rosterGrid.style.display = 'none';
            if(noResults) noResults.style.display = 'block';
        } else {
            rosterGrid.style.display = 'grid'; // Reset display type to grid
            if(noResults) noResults.style.display = 'none';
            
            // Generate HTML string and insert
            const htmlString = membersToRender.map(createMemberCard).join('');
            rosterGrid.innerHTML = htmlString;
            
            // Manually add 'visible' to fade-ins since they are loaded dynamically
            // outside the initial IntersectionObserver pass
            setTimeout(() => {
                const newCards = rosterGrid.querySelectorAll('.fade-in');
                newCards.forEach(card => card.classList.add('visible'));
            }, 50);
        }

        // Update active count
        if (totalCount) {
            totalCount.textContent = membersToRender.length;
        }
    }

    // Initialize with all members
    if (rosterGrid) {
        renderRoster(rosterData);

        // Attach event listener to search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                const filteredMembers = rosterData.filter(member => {
                    return member.callsign.toLowerCase().includes(searchTerm) || 
                           member.role.toLowerCase().includes(searchTerm);
                });
                
                renderRoster(filteredMembers);
            });
        }
    }
});