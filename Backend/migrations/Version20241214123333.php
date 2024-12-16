<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241214123333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE advice (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(50) NOT NULL, message LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE goals (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, goal VARCHAR(50) NOT NULL, desired_sum DOUBLE PRECISION NOT NULL, actual_sum DOUBLE PRECISION NOT NULL, reached TINYINT(1) NOT NULL, INDEX IDX_C7241E2FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE masrouf (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, value DOUBLE PRECISION NOT NULL, date DATE NOT NULL, type VARCHAR(50) NOT NULL, INDEX IDX_7EF3196FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE revenue (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, value DOUBLE PRECISION NOT NULL, date DATE NOT NULL, type VARCHAR(50) NOT NULL, INDEX IDX_E9116C85A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE goals ADD CONSTRAINT FK_C7241E2FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE masrouf ADD CONSTRAINT FK_7EF3196FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE revenue ADD CONSTRAINT FK_E9116C85A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE goals DROP FOREIGN KEY FK_C7241E2FA76ED395');
        $this->addSql('ALTER TABLE masrouf DROP FOREIGN KEY FK_7EF3196FA76ED395');
        $this->addSql('ALTER TABLE revenue DROP FOREIGN KEY FK_E9116C85A76ED395');
        $this->addSql('DROP TABLE advice');
        $this->addSql('DROP TABLE goals');
        $this->addSql('DROP TABLE masrouf');
        $this->addSql('DROP TABLE revenue');
        $this->addSql('DROP TABLE user');
    }
}
