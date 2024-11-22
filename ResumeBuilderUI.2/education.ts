function addDegree() {
    const degreeContainer = document.getElementById('degreeContainer') as HTMLElement;
    const degreeList = document.getElementById('degreeList') as HTMLUListElement;
  
    // Get values from inputs
    const college = (document.getElementById('college') as HTMLInputElement).value;
    const cityState = (document.getElementById('cityState') as HTMLInputElement).value;
    const degreeType = (document.getElementById('degreeType') as HTMLSelectElement).value;
    const major = (document.getElementById('major') as HTMLSelectElement).value;
    const yearGraduated = (document.getElementById('yearGraduated') as HTMLInputElement).value;
  
    if (!college || !cityState || !degreeType || !major || !yearGraduated) {
      alert('Please fill out all fields before adding a degree.');
      return;
    }
  
    // Create a new degree preview item
    const degreeItem = document.createElement('li');
    degreeItem.className = 'degree-item';
  
    // Create hyperlink for the degree
    const degreeLink = document.createElement('a');
    degreeLink.href = '#';
    degreeLink.innerText = `${degreeType}`;
    degreeLink.onclick = () => {
      // Prefill the form with the clicked degree's details
      (document.getElementById('college') as HTMLInputElement).value = college;
      (document.getElementById('cityState') as HTMLInputElement).value = cityState;
      (document.getElementById('degreeType') as HTMLSelectElement).value = degreeType;
      (document.getElementById('major') as HTMLSelectElement).value = major;
      (document.getElementById('yearGraduated') as HTMLInputElement).value = yearGraduated;
    };
  
    degreeItem.appendChild(degreeLink);
    degreeList.appendChild(degreeItem);
  
    // Clear the form fields
    (document.getElementById('college') as HTMLInputElement).value = '';
    (document.getElementById('cityState') as HTMLInputElement).value = '';
    (document.getElementById('degreeType') as HTMLSelectElement).value = '';
    (document.getElementById('major') as HTMLSelectElement).value = '';
    (document.getElementById('yearGraduated') as HTMLInputElement).value = '';
  }
  