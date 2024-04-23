document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const stakeholderName = decodeURIComponent(urlParams.get('name'));

    fetch('https://script.google.com/macros/s/AKfycbx9YOQSJobZEUaYmuNkeCkCBGwoO75oKecPEAACmSQH7bzm9G2TFnsJZ3h0IxRSIDY/exec')
        .then(response => response.json())
        .then(data => {
            populateNavigation(data); // Populate navigation with fetched data
            const stakeholder = data.find(s => s.Name === stakeholderName);
            if (stakeholder) {
                populateStakeholderPage(stakeholder);
            }
        });

        function populateStakeholderPage(stakeholder) {
            const main = document.getElementById('stakeholder-content');
            main.innerHTML = `<h1>${stakeholder.Name}</h1>`; // Add the stakeholder name as the main title
        
            // Display the image
            if (stakeholder.ImageUrl) {
                const image = document.createElement('img');
                image.src = stakeholder.ImageUrl;
                image.alt = stakeholder.Name;
                image.style.width = '25%';
                main.appendChild(image);
            }
        
            // Add the hyperlink for the Name
            if (stakeholder.Link) {
                const linkSection = document.createElement('section');
                linkSection.innerHTML = `
                    <h2>Link</h2>
                    <p><a href="${stakeholder.Link}" target="_blank">${stakeholder.Link}</a></p>
                `;
                main.appendChild(linkSection);
            }
        
            // Add other details
            Object.keys(stakeholder).forEach(key => {
                if (['Name', 'Latitude', 'Longitude', 'Primary', 'ImageUrl', 'Link'].indexOf(key) === -1) { // Exclude certain fields
                    const section = document.createElement('section');
                    section.innerHTML = `<h2>${key}</h2><p>${stakeholder[key]}</p>`;
                    main.appendChild(section);
                }
            });
        }
        

    function populateNavigation(data) {
        var stakeholdersList = document.querySelector('.drop div');
        stakeholdersList.innerHTML = ''; // Clear existing list if any
        data.forEach(stakeholder => {
            if (!stakeholdersList.innerHTML.includes(stakeholder.Primary)) {
                var listItem = document.createElement('li');
                var link = document.createElement('a');
                link.href = `stakeholders.html?name=${encodeURIComponent(stakeholder.Primary)}`; // Use the primary group name as the parameter
                link.textContent = stakeholder.Primary;
                listItem.appendChild(link);
                stakeholdersList.appendChild(listItem);
            }
        });
    }
});
