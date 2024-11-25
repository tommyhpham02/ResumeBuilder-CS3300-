/*
const MAX_EDUCATIONS = 3;

const educationContainer = document.getElementById("educationContainer") as HTMLElement;
const addEducationButton = document.getElementById("addEducationButton") as HTMLInputElement;
const educationList = document.getElementById("educationList") as HTMLUListElement;

let educationCount = 1;

// Function to add a new edu entry
function addEducation(): void {
  if (educationCount >= MAX_EDUCATIONS) {
    alert("You can only add up to 3 edu entries.");
    return;
  }

  // Create a new edu entry
  const educationEntry = document.createElement("div");
  educationEntry.classList.add("education-entry");
  educationEntry.innerHTML = `
 <div class="user-details" id="degreeContainer">
          <!-- Input for College -->
          <div class="input-box">
            <span class="details">College</span>
            <input type="text" id="college" placeholder="Enter your Full College Name" required>
          </div>
          <!-- Input for City/State -->
          <div class="input-box">
            <span class="details">City/State</span>
            <input type="text" id="cityState" placeholder="Enter the City and State" required>
          </div>
          <!-- Degree Type Dropdown -->
          <div class="input-box">
            <span class="details">Degree Type</span>
            <select id="degreeType" required>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelors Degree">Bachelors Degree</option>
              <option value="Masters Degree">Masters Degree</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <!-- Major Dropdown -->
          <div class="input-box">
            <span class="details">Major</span>
            <select id="major" required>
              <option value="Computer Science">Computer Science</option>
              <option value="Management">Management</option>
              <option value="Computer Engineering">Computer Engineering</option>
            </select>
          </div>
          <!-- Input for Year Graduated -->
          <div class="input-box">
            <span class="details">Year Graduated</span>
            <input type="text" id="yearGraduated" placeholder="Enter the year you graduated" required>
          </div>
        </div>
  `;

  // Add the new edu entry to the container
  educationContainer.appendChild(educationEntry);

  

  // Add the edu to the preview list as a hyperlink
  addEducationToPreview(educationEntry);

  educationCount++;
}


// Function to add a edu to the preview list
function addEducationToPreview(educationEntry: HTMLElement): void {
  const positionInput = educationEntry.querySelector(".position-input") as HTMLInputElement;
  const position = positionInput?.value || `Education ${educationCount}`;

  const listItem = document.createElement("li");

  // Create a hyperlink-like appearance
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = position;
  link.classList.add("education-link");

  // Append the link to the list item
  listItem.appendChild(link);
  educationList.appendChild(listItem);
}

// Attach event listener to the Add edu button
addEducationButton.addEventListener("click", addEducation);
*/

