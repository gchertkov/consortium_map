document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const stakeholderName = decodeURIComponent(urlParams.get('name'));

    fetch('https://script.google.com/macros/s/AKfycbx9YOQSJobZEUaYmuNkeCkCBGwoO75oKecPEAACmSQH7bzm9G2TFnsJZ3h0IxRSIDY/exec')
        .then(response => response.json())
        .then(data => {
            populateNavigation(data); // Populate navigation with fetched data
            const stakeholder = data.find(s => s.Name === stakeholderName);
            if (stakeholder) {
                populateStakeholderPage(stakeholder, data);
            }
        });

        function populateStakeholderPage(stakeholder, data) {
            const main = document.getElementById('stakeholder-content');
            main.innerHTML = `<h1>${stakeholder.Name}</h1><a href='${stakeholder.Link}' target='_blank'>Link to organization  site</a><br><br>`; // Add the stakeholder name as the main title and a hyperlink below it
        
            if (stakeholder.ImageUrl) {
                const image = document.createElement('img');
                image.src = stakeholder.ImageUrl;
                image.alt = stakeholder.Name;
                image.style.width = '25%';
                image.style.height = '25%'; // Adjust the image size as needed
                main.appendChild(image);
            }
        
            // Check if this stakeholder is a secondary stakeholder
            if (stakeholder.Primary && stakeholder.Name !== stakeholder.Primary) {
                // Display backlink to primary if not the primary page
                const primaryLink = document.createElement('a');
                primaryLink.href = `stakeholders.html?name=${encodeURIComponent(stakeholder.Primary)}`;
                primaryLink.textContent = `Back to ${stakeholder.Primary}`;
                main.appendChild(document.createElement('br'));
                main.appendChild(primaryLink);
            }
        
            // Display links to other secondary stakeholders if applicable
            const secondaryStakeholders = data.filter(item => item.Primary === stakeholder.Primary && item.Name !== stakeholder.Name);
            if (secondaryStakeholders.length > 0) {
                const linksContainer = document.createElement('div');
                linksContainer.innerHTML = `<h2>Associated Facilities</h2>`;
                secondaryStakeholders.forEach(secondary => {
                    const link = document.createElement('a');
                    link.href = `stakeholders.html?name=${encodeURIComponent(secondary.Name)}`;
                    link.textContent = secondary.Name;
                    linksContainer.appendChild(document.createElement('br'));
                    linksContainer.appendChild(link);
                });
                main.appendChild(linksContainer);
            }
        
            // Add other details
            Object.keys(stakeholder).forEach(key => {
                if (!['Name', 'Latitude', 'Longitude', 'Primary', 'ImageUrl', 'Link','Country'].includes(key)) {
                    const section = document.createElement('section');
                    section.innerHTML = `<h2>${key}</h2><p>${stakeholder[key].replace(/\n/g, '<br>')}</p>`;
                    main.appendChild(section);
                }
            });
        }
        
        
        function populateNavigation(data) {
            var stakeholdersList = document.querySelector('.drop div');
            stakeholdersList.innerHTML = ''; // Clear existing list if any
        
            // Sort the stakeholders alphabetically by the 'Primary' field
            data.sort((a, b) => a.Primary.localeCompare(b.Primary));
        
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
