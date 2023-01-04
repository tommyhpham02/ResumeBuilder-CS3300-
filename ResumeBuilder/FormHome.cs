﻿namespace ResumeBuilder
{
    public partial class FormHome : Form
    {
        private Button currentButton;
        private Form activeForm;

        //*****DRAG FORM FIELDS*****
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern bool ReleaseCapture();
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        public FormHome()
        {
            InitializeComponent();
        }

        //*****CHILDFORM METHODS*****
        private void OpenChildForm(Form childForm, object btnSender)
        {
            if (activeForm != null) { activeForm.Close(); }
            ActivateButton(btnSender);
            activeForm = childForm;
            childForm.TopLevel = false;
            childForm.FormBorderStyle = FormBorderStyle.None;
            childForm.Dock = DockStyle.Fill;
            this.childFormPanel.Controls.Add(childForm);
            this.childFormPanel.Tag = childForm;
            childForm.BringToFront();
            childForm.Show();
        }
        private void ActivateButton(object btnSender)
        {
            if (btnSender != null)
            {
                if (currentButton != (Button)btnSender)
                {
                    DisableButton();
                    currentButton = (Button)btnSender;
                    currentButton.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
                    currentButton.ForeColor = Color.White;
                    homeButton.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
                    homeButton.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(238)))), ((int)(((byte)(238)))), ((int)(((byte)(238)))));
                }
            }
        }
        private void DisableButton()
        {
            foreach (Control previousBtn in leftMenuPanel.Controls)
            {
                if (previousBtn.GetType() == typeof(Button))
                {
                    previousBtn.BackColor = Color.FromArgb(33, 33, 33);
                    previousBtn.ForeColor = Color.Gainsboro;
                    previousBtn.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
                }
            }
        }

        //*****CHILDFORM EVENTS*****
        private void personalDetailsPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new PersonalDetailsForm(), sender);
        }
        private void addJobExperiencePanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new JobExperienceForm(), sender);
        }
        private void educationPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new EducationsForm(), sender);
        }
        private void settingsPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new SettingsForm(), sender);
        }
        private void aboutPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new AboutForm(), sender);
        }
        private void selectPhotoPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new PhotoUploadForm(), sender);
        }
        private void addMoreDetailPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new MoreDetailsForm(), sender);
        }
        private void layoutPanelButton_Click(object sender, EventArgs e)
        {
            OpenChildForm(new LayoutForm(), sender);
        }
        private void homeButton_Click(object sender, EventArgs e)
        {
            if (activeForm != null)
            {
                activeForm.Close();
                DisableButton();
                homeButton.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
                homeButton.ForeColor = Color.White;
            }
        }

        //*****OTHER EVENTS*****
        private void closeAppBtn_Click(object sender, EventArgs e)
        {
            FormLogin formLogin = new FormLogin();
            AppControllers appControllers = new AppControllers();
            formLogin.getId().ToString().Trim();
            DialogResult dialogResult = MessageBox.Show("Do you want to save your data?", "Closing Application", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                //do something
            }
            else if (dialogResult == DialogResult.No)
            {
                if (formLogin.getId().ToString().Trim() == "")
                {
                    appControllers.insertDataSql($"delete from Person where id = '{formLogin.getId().ToString().Trim()}'; delete from Job where id = '{formLogin.getId().ToString().Trim()}'; delete from Education where id = '{formLogin.getId().ToString().Trim()}'; delete from MoreDetails where id = '{formLogin.getId().ToString().Trim()}'");
                }
            }
            Application.Exit();
        }
        private void childFormPanel_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }
        private void navigationPanel_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }

        private void printButton_Click(object sender, EventArgs e)
        {
            SaveFileDialog save = new SaveFileDialog();
            save.OverwritePrompt = false;
            save.CreatePrompt = true;
            save.InitialDirectory = @"D:\";
            save.Title = "Save PDF File";
            save.DefaultExt = "pdf";
            save.Filter = "PDF Files (*.pdf)|*.pdf|All Files(*.*)|*.*";
            //if (save.ShowDialog() == DialogResult.OK)
            //{
            //    MessageBox.Show("Saved!");
            //}
            AppControllers appControllers = new AppControllers();
            ResumeLayouts resumeLayouts = new ResumeLayouts();
            try
            {

                resumeLayouts.ClassicLayout(save.FileName, appControllers.fillPdfFields().Item2.ToString(), appControllers.fillPdfFields().Item3.ToString(), appControllers.fillPdfFields().Item4.ToString(), appControllers.fillPdfFields().Item5.ToString(), appControllers.fillPdfFields().Item6.ToString(), appControllers.fillPdfFields().Item7.ToString(), appControllers.fillPdfFields().Item8.ToString(), appControllers.fillPdfFields().Item9.ToString(), appControllers.fillPdfFields().Item10.ToString());
            }
            catch (System.NullReferenceException ex)
            {

                MessageBox.Show(ex.Message);
            }
        }
    }
}