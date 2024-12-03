# ResumYay
This project is a web application that allows users to create and manage their resumes.<br>
It is built using C#, Angular, .Net, Typesript, Swagger, CSS, HTML and it uses a SQL Server database to store and retrieve data.<br>
<h1>Features</h1>
<ul>
  <li>Create your resume using 6 different layouts</li>
  <li>Automatically saving</li>
  <li>Export your all created resumes</li>
  <li>Print as Pdf file</li>
  <li>You can add: Name, Phone Number, Email, Website, Summary, Job information, Education information, Skills, Languages, Certifications</li>
  <li>Keyword suggestions for Computer Science and Business Degrees</li>
</ul>

<h1>Usage</h1>
Usage
To use this project, follow these steps:
<ul>
<li>Open the project in Visual Studio.</li>
<li>Build and run the project.</li>
<li>Fill in your personal details, job history, education, and more details.</li>
<li>Choose a resume layout and export your resume as a PDF.</li>
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
   - In VS code go to the ResumeBuilderUI.2 folder
   - Run this command in VS Code:
     ```bash
     npm install
     ```
  - Reset Visual Studio Code
### 3. Database Installation

We will be using SQL Server 2022 and to view the data in the database the application being used 
SQL Server Managment Studio 20.

1. **Download SQL Server 2022:**
   - Go to the [SQL Server download page](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) and download the SQL Server 2022 Developer.
   - After installation a page will prompt the users to connect the server using the connect now button.
   - A command prompt window will pop up after hitting the connect button. Then you can close the installer.

2. **Download SQL Server Managment Studio 20:**
   - Go to the [SQL Server Managment Studio 20 download page](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16) and download the SQL Server 2022 Developer. You can download SMSS from the SQL Server 2022 Installer.

3. **Using SQL Server:**
   - Open up SQL Server Managment Studio 20.
   - Uses the icon with an outlet.
   - Look at Server name and copy that name. (for later use)
   - Open the C# project in visual studio 2022, it will be located in the ResumeBuilder(Team9) folder.
   - In the solution explorer on the right side of the project, find appsettings.json and look for this code on line 10. (The line bellow is the line that you are modifying)
      ```bash
     "Data Source=DESKTOP-HB3HD5S;TrustServerCertificate=True;Initial Catalog = ResumeBuilderDb; Integrated Security = true;"
     ```
   - Replace Data Source with the Server name you copyed from the previous step. ("Source=DESKTOP-HB3HD5S;")
   - In Package Manager Console, update the database with the comand bellow.
      ```bash
     update-database
     ```
       >If you can not find the Package manager Console, use tools->Nu Get Package Manager->Package Manager Consol.
   - Now the database is set up and ready to be used.
   - Now you can go back to SQL server managment studio, make sure to press the check box next to the trust server certificate, then press connect at the bottom left of the connect to server window.

### 4. Run the Angular Application

1. **Start the Development Server:**
   - Open the ResumeBuilderUI.2 folder in VS code.
   - Run the following command in the terminal to start the Angular development server: (Make sure the terminal path is the ResumeBuilderUI.2)
     ```bash
     ng serve -o
     ```

  - If you get an error that states you can not run scripts on the current system. You will have to give your computer permission to runs scripts by running this comand in your powershell in admistrator mode.
      ```bash
     Set-ExecutionPolicy -ExecutionPolicy Unrestricted
     ```
  - If you get this error "Error: Could not find the '@angular-devkit/build-angular:dev-server' builder's node package." look at the sulution in part 2 step 3.
  - 

3. **Access the Application:**
   - Open your browser and navigate to `http://localhost:4200` to view your Angular application.


### 5. Running the program.

To start running the database make sure to run RsumeBuilder(Team 9) project by pressing the HTTPS button near the top where you would normally see your debug compiler button.

Once the back end is running a swagerUI page with open in your default browser. (make sure that the settings on that browser are allowing localhost pages to be launched).

The front end will start running when you type in the terminal "ng serve -o" (we did this in part 4 step 1).


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
