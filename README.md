Dar Dinar
Dar Dinar is a financial management application specifically designed for Tunisian users. It aims to simplify budgeting, tracking expenses, and managing finances through a user-friendly interface. Whether you're an individual or a small business, Dar Dinar provides the tools you need to make informed financial decisions and gain better control over your finances.

Features
Expense Tracking: Easily record and categorize your daily expenses to keep an eye on where your money goes.
Income Management: Manage multiple income streams and gain insights into your earnings.
Budget Planning: Set monthly or yearly budgets and monitor your spending against them.
Financial Reports: Generate detailed reports to visualize your spending habits and identify areas for improvement.
Secure Authentication: Ensure your financial data is safe with secure user authentication and encrypted data storage.
Localized for Tunisia: Tailored specifically to Tunisian financial contexts, including local currencies and financial regulations.
Installation
Prerequisites
PHP (version 8.1 or higher)
Composer
Symfony CLI (optional but recommended)
MySQL or PostgreSQL database
Steps to Install
Clone the Repository:

bash
Copier le code
git clone https://github.com/ahmede9ka/Dar-Dinar.git
cd Dar-Dinar
Install Dependencies:

bash
Copier le code
composer install
Set Up Environment Variables: Copy the .env file and rename it to .env.local, then configure your database connection and other environment-specific settings:

bash
Copier le code
cp .env .env.local
Create the Database:

bash
Copier le code
php bin/console doctrine:database:create
Run Migrations:

bash
Copier le code
php bin/console doctrine:migrations:migrate
Start the Development Server: If you have Symfony CLI installed:

bash
Copier le code
symfony server:start
Alternatively, you can run the server with PHP:

bash
Copier le code
php -S localhost:8000 -t public
Usage
Access the app: Open your web browser and navigate to http://localhost:8000.
Create an account: Register and log in to start managing your finances.
Add financial data: Use the dashboard to add and categorize your income and expenses.
Review reports: Go to the reports section to view financial insights and trends.
Contributing
We welcome contributions from the community! If you'd like to improve Dar Dinar, follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Make your changes and commit (git commit -m "Add new feature").
Push your changes (git push origin feature/your-feature-name).
Create a pull request.
License
This project is licensed under the MIT License.

Acknowledgements
Symfony Framework: For providing a powerful PHP framework for web applications.
Open-Source Libraries: Various libraries and packages that made development faster and more efficient.
Contributors: Thank you to everyone who has helped in making this project a reality.
Contact
For any questions or feedback, please contact us at [your-email@example.com] or visit our GitHub Issues.
