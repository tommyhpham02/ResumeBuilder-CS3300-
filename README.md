# Resume Builder
This project is a desktop application that allows users to create and manage their resumes.<br>
It is built using C# and Windows Forms, and it uses a SQL Server database to store and retrieve data.<br>
![alt text](https://repository-images.githubusercontent.com/576042902/37e60d01-004b-4d49-89be-d1189cf4b9c1)
<h1>Features</h1>
<ul>
  <li>Save multiple Resumes for one person and edit anytime.</li>
  <li>Save your resume using multiple layouts</li>
  <li>Automatically saving</li>
  <li>Import and Export your all created resumes</li>
  <li>Print as Pdf or MS Word(docx) file</li>
  <li>You can add; Name, Address, Phone Number, Email, Website, Social Media Links, Summary, Job informations, Education informations, Skills, Languages, Certifications and Photo to your resume.</li>
  <li>Edit Titles for any language</li>
  <li>Change Font and Picture Sizes</li>
  <li>English and Turkish UI</li>
</ul>

<h1>Usage</h1>
Usage
To use this project, follow these steps:
<ul>
<li>Open the project in Visual Studio.</li>
<li>Build and run the project.</li>
<li>Fill in your personal details, job history, education, and more details.</li>
<li>Upload your photo.</li>
<li>Choose a resume layout and export your resume as a PDF or DOCX file.</li>
<li>Import or export your resume data as a JSON file.</li>
<li>View information about the developer and visit their Github profile.</li>
</ul>

## IDE

In this program you will need two IDE. Visual Studio 2022 for the Backend (C#) and Visual Studio Code for the Frontend (HTML, TypeScript, CSS).

## Frontend

To develop Angular applications, you need to install Node.js and npm (Node Package Manager). Follow these steps to install Node.js, npm, and Angular CLI.

### 1. Install Node.js and npm

#### On Windows

1. **Download Node.js:**
   - Go to the [Node.js download page](https://nodejs.org/) and download the Windows Installer (`.msi`) for the LTS (Long Term Support) version.

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file and follow the prompts. Ensure that the option to install `npm` is selected.

3. **Verify Installation:**
   - Open Command Prompt and run:
     ```bash
     node -v
     npm -v
     ```
   - Confirm that Node.js and npm are installed correctly by seeing a version upon running those commands.

4.    **If you get an error saying "cannot be loaded because running scripts is disabled on this system":**
    - Type env in the windows bar.
    - Select the Environment Variables in the bottom corner.
    - Click on "Path"
    - Find the path for npm. For example "C:\Users\SomeUser\AppData\Roaming\npm"
    - Close env.

### 2. Install Angular CLI

With Node.js and npm installed, you can now install Angular CLI.

1. **Install Angular CLI:**
   - Open a terminal or Command Prompt and run:
     ```bash
     npm install -g @angular/cli
     ```

2. **Verify Angular CLI Installation:**
   - Check the version of Angular CLI:
     ```bash
     ng version
     ```

3. **If you get this error "Could not find the implementation for builder @angular-devkit/build-angular:dev-server on ng serve command [duplicate]":**
   - Run this command:
     ```bash
     npm install --save-dev @angular-devkit/build-angular
     ```
  - Reset Visual Studio Code

### 3. Run the Angular Application

1. **Start the Development Server:**
   - Run the following command to start the Angular development server:
     ```bash
     ng serve -o
     ```

2. **Access the Application:**
   - Open your browser and navigate to `http://localhost:4200` to view your Angular application.


### 4. Database Installation

We will be using SQL Server 2022 and to view the data in the database the application being used 
SQL Server Managment Studio 20.

1. **Download SQL Server 2022:**
   - Go to the [SQL Server download page](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16) and download the SQL Server 2022 Developer.

2. **Creating SQL Server:**
   - After installation a page will prompt the users to connect the server using the connect now button.
   - A command prompt window will pop up after is stop running you can close it.

3. **Download SQL Server Managment Studio 20:**
   - Go to the [SQL Server Managment Studio 20 download page](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) and download the SQL Server 2022 Developer r you can download SMSS from the SQL Server 2022 Installer.

2. **Using SQL Server:**
   - Open up SQL Server Managment Studio 20.
   - Uses the icon with an outlet.
   - Look at Server name and copy that name.
   - In the c# program go to appsettings.json and find this code.
      ```bash
     "Data Source=DESKTOP-HB3HD5S;TrustServerCertificate=True;Initial Catalog = ResumeBuilderDb; Integrated Security = true;"
     ```
   - Replace Data Source with the Server name we copyed and save.
   - Then in open a Pakage Manager page from other windows and uses this command.
      ```bash
     update-database
     ```

### 5. Running the program.

In the repository you to run the backend you will need to go into the RsumeBuilder(Team 9) folder and find the solution file. Then run the program like normal.

In the repository you to run the frontend you will need to go into the ResumeBuilderUI.2 folder in VS Code. Then open a terminal in VS code and uses this command:
    ```bash
     ng serve -o
     ```
The application should open the Swagger UI and the Front Page.


<h1>Contributing</h1>
This project is open for contributions. If you find any bugs or issues, please report them on the Github repository. You can also suggest new features or improvements.

<h1>Built With</h1>
<ul>
  <li>VISUAL STUDIO 2022</li>
  <li>SQL SERVER 2022</li>
  <li>Quest PDF .NET Library</i>   
  <li>SQL SERVER MANAGMENT STUDIO 20</i>
</ul>

<h1>License</h1>
Licensed under the GPL 3.0 license.
