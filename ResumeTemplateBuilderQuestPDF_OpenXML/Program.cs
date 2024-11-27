using System;
using WordBody = DocumentFormat.OpenXml.Wordprocessing.Body;


namespace ResumeBuilder
{
    internal class Program
    {
        static void Main(string[] args)
        {
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;


            // Instantiate the ResumeLayouts class
            ResumeLayouts resumeLayouts = new ResumeLayouts();


            // Set titles for resume sections
            resumeLayouts.titles = new[]
            {
                "Work Experience", "Education", "Certifications",
                "Projects", "Languages", "Interests", "Skills"
            };

            // Input data for the resume
            string filePath = @"C:\Users\tarek\Documents\ResumeProjectTest\Resume.pdf"; // Change this to a valid path on your system
            string wordFilePath = @"C:\Users\tarek\Documents\ResumeProjectTest\Resume.docx"; // Word file path
            string fullName = "Johnathan Alexander Doe";
            string personalDetails = "123 Main St, Springfield, IL 62701 | johndoe@example.com | (123) 456-7890 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe";
            string jobHistory = "Software Engineer | ABC Corporation, Springfield, IL | 2018 - 2023\n" +
                                "- Spearheaded the development of high-performance web applications for enterprise clients, improving system efficiency by 30%. \n" +
                                "- Led a team of 4 developers to design and implement microservices architecture, increasing scalability and reducing downtime. \n" +
                                "- Integrated CI/CD pipelines using Azure DevOps, reducing deployment time by 50%. \n" +
                                "- Collaborated with cross-functional teams to optimize user experience and implement agile methodologies, resulting in faster delivery cycles.\n" +
                                "- Mentored junior engineers and conducted code reviews to maintain high-quality standards.";

            string education = "BSc in Computer Science | Springfield University, Springfield, IL | 2014 - 2018\n" +
                              "- Graduated with Honors, GPA: 3.9/4.0\n" +
                              "- Relevant Coursework: Data Structures & Algorithms, Software Engineering, Cloud Computing, Database Management Systems, AI & Machine Learning.\n" +
                              "- Participated in the university’s coding competition team, securing 2nd place in the Midwest Regional Hackathon.";

            string certifications = "Certified Kubernetes Administrator (CKA) | Cloud Native Computing Foundation | 2023\n" +
                                   "AWS Certified Solutions Architect – Associate | Amazon Web Services | 2022\n" +
                                   "Microsoft Certified: Azure Fundamentals | Microsoft | 2021\n" +
                                   "Certified ScrumMaster (CSM) | Scrum Alliance | 2020";

            string projects = "Open-source Contributor | Project X | GitHub: github.com/johndoe/project-x | 2020 - Present\n" +
                              "- Contributed to an open-source machine learning project that aids small businesses in automating their inventory management system.\n" +
                              "- Developed features for data preprocessing and integrated with popular cloud storage solutions.\n" +
                              "\n" +
                              "Personal Website: johndoe.dev | 2021 - Present\n" +
                              "- Built and maintain a personal portfolio website showcasing my development projects, blog posts, and technical achievements.\n" +
                              "- The website receives over 1,000 visitors per month and serves as a resource hub for aspiring developers.";

            string languages = "English (Native), Spanish (Fluent), French (Basic)";

            string hobbies = "Photography (Landscape & Portrait), Hiking, Chess (Local Club Champion), Traveling (Visited 15 countries), Blogging (Technical Articles on Medium)";

            string skills = "Programming Languages: C#, JavaScript, TypeScript, Python\n" +
                           "Web Development: .NET Core, React, Node.js, Angular\n" +
                           "Cloud Technologies: Azure, AWS, Docker, Kubernetes\n" +
                           "Database Management: SQL Server, PostgreSQL, MongoDB\n" +
                           "DevOps: Azure DevOps, Jenkins, Git, CI/CD pipelines\n" +
                           "Tools & Frameworks: Git, Visual Studio, IntelliJ IDEA, Docker, Terraform, Kubernetes, Nginx\n" +
                           "Soft Skills: Team Collaboration, Agile Methodology, Problem Solving, Leadership, Communication";

            string summary = "I am an experienced Software Engineer with a passion for solving complex problems and building scalable, high-performance applications. " +
                             "With a solid foundation in web development, cloud computing, and DevOps, I have a proven track record of driving projects to completion. " +
                             "I am a strong advocate for clean code, best practices, and continuous improvement. I am now looking for new opportunities to grow my skills in a collaborative environment " +
                             "while contributing to innovative software solutions.";

            // Generate the PDF
            try
            {
                resumeLayouts.ClassicLayout(
                    filePath,
                    fullName,
                    personalDetails,
                    jobHistory,
                    education,
                    certifications,
                    projects,
                    languages,
                    hobbies,
                    skills,
                    summary
                );

                Console.WriteLine("Resume generated successfully at: " + filePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }

            try
            {
                ResumeLayouts2 resumeLayouts2 = new ResumeLayouts2();

                // Set titles for the new layout
                resumeLayouts2.titles = new[]
                {
        "Work Experience", "Education", "Certifications",
        "Projects", "Languages", "Interests", "Skills"
    };

                // Generate the second resume
                string newFilePath = @"C:\Users\tarek\Documents\ResumeProjectTest\ResumeNew.pdf";
                resumeLayouts2.NewLayout(
                    newFilePath,
                    fullName,
                    personalDetails,
                    jobHistory,
                    education,
                    certifications,
                    projects,
                    languages,
                    hobbies,
                    skills,
                    summary
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while generating the Word document: " + ex.Message);
            }

            Console.WriteLine("Resume generated successfully at: " + filePath);

            try
            {
                BResumeLayouts BResumeLayout = new BResumeLayouts();

                // Set titles for the new layout
                BResumeLayout.titles = new[]
                {
        "Work Experience", "Education", "Certifications",
        "Projects", "Languages", "Interests", "Skills"
    };

                // Generate the second resume
                string newFilePath = @"C:\Users\tarek\Documents\ResumeProjectTest\ResumeB.pdf";
                BResumeLayout.BResumeLayout(
                    newFilePath,
                    fullName,
                    personalDetails,
                    jobHistory,
                    education,
                    certifications,
                    projects,
                    languages,
                    hobbies,
                    skills,
                    summary
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while generating the Word document: " + ex.Message);
            }


            // Generate the Word Document
            try
                {
                    WordResumeBuilder resumeBuilder = new WordResumeBuilder();

                    resumeBuilder.ExportToWord(
                        wordFilePath,
                        fullName,
                        personalDetails,
                        jobHistory,
                        education,
                        certifications,
                        projects,
                        languages,
                        hobbies,
                        skills,
                        summary
                    );

                    Console.WriteLine("Resume Word document generated successfully at: " + wordFilePath);
                }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
        }
    }
}
