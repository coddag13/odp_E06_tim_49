CREATE DATABASE IF NOT EXISTS DEFAULT_DB;
USE DEFAULT_DB;

-- Tabela korisnika
-- Korisnici
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Glavni sadržaj (filmovi/serije)
CREATE TABLE Content (
    content_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_date DATE,
    cover_image VARCHAR(255),
    genre VARCHAR(100),
    type ENUM('movie', 'series') NOT NULL,
    average_rating DECIMAL(4,2) DEFAULT 0.00, -- prosečna ocena
    rating_count INT DEFAULT 0,               -- broj glasova
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Epizode (samo za serije)
CREATE TABLE Episodes (
    episode_id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    season_number INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    FOREIGN KEY (content_id) REFERENCES Content(content_id) ON DELETE CASCADE
);

-- Trivia (zanimljivosti)
CREATE TABLE Trivia (
    trivia_id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    trivia_text TEXT NOT NULL,
    FOREIGN KEY (content_id) REFERENCES Content(content_id) ON DELETE CASCADE
);

-- ===================================
-- INSERT primeri podataka
-- ===================================

-- Korisnici
INSERT INTO Users (username, password_hash, email, role) VALUES
('marko', 'hash_lozinka_1', 'marko@example.com', 'user'),
('ana', 'hash_lozinka_2', 'ana@example.com', 'user'),
('admin', 'hash_lozinka_3', 'admin@example.com', 'admin');

-- Filmovi i serije
INSERT INTO Content (title, description, release_date, cover_image, genre, type, average_rating, rating_count) VALUES
('The Shawshank Redemption', 'Priča o nepravedno osuđenom čoveku i njegovom putu ka slobodi.', '1994-09-22', 'shawshank.jpg', 'Drama', 'movie', 9.5, 1200),
('Breaking Bad', 'Profesor hemije postaje narko-bos.', '2008-01-20', 'breakingbad.jpg', 'Krimi', 'series', 9.3, 2500),
('Inception', 'Krađa tajni iz podsvesti putem snova.', '2010-07-16', 'inception.jpg', 'Sci-Fi', 'movie', 8.7, 1800);

-- Epizode za Breaking Bad (pretpostavljamo da je ID = 2)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image) VALUES
(2, 1, 1, 'Pilot', 'Walter White saznaje da ima rak i odlučuje da kuva metamfetamin.', 'bb_s1e1.jpg'),
(2, 1, 2, 'Cat''s in the Bag...', 'Walter i Jesse pokušavaju da se reše tela.', 'bb_s1e2.jpg');

-- Trivia
INSERT INTO Trivia (content_id, trivia_text) VALUES
(1, 'Film je sniman u Ohio State Reformatory.'),
(2, 'Bryan Cranston je osvojio više Emmy nagrada za ovu ulogu.'),
(3, 'Za scenu nulte gravitacije korišćen je rotirajući hodnik.');

SELECT * FROM Content;