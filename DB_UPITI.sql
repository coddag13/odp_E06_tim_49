-- 1) Baza i tabele
CREATE DATABASE IF NOT EXISTS default_db;
USE default_db;

CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Content (
  content_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  release_date DATE,
  cover_image VARCHAR(255),
  genre VARCHAR(100),
  type ENUM('movie','series') NOT NULL,
  average_rating DECIMAL(4,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Episodes (
  episode_id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT NOT NULL,
  season_number INT NOT NULL,
  episode_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  FOREIGN KEY (content_id) REFERENCES Content(content_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Trivia (
  trivia_id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT NOT NULL,
  trivia_text TEXT NOT NULL,
  FOREIGN KEY (content_id) REFERENCES Content(content_id) ON DELETE CASCADE
);

-- 2) Seed korisnika (radi i ako već postoje)
INSERT INTO Users (username, password_hash, email, role)
SELECT 'marko','hash_lozinka_1','marko@example.com','user'
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username='marko');

INSERT INTO Users (username, password_hash, email, role)
SELECT 'ana','hash_lozinka_2','ana@example.com','user'
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username='ana');

INSERT INTO Users (username, password_hash, email, role)
SELECT 'admin','hash_lozinka_3','admin@example.com','admin'
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username='admin');

-- 3) Seed za Content (10 naslova) – bez duplikata
INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Shawshank Redemption',
       'Priča o nepravedno osuđenom čoveku i njegovom putu ka slobodi.',
       '1994-09-22',
       'https://upload.wikimedia.org/wikipedia/commons/b/b0/The_Dark_Knight_Batman.jpg',
       'Drama','movie',9.50,1200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Shawshank Redemption' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Breaking Bad',
       'Profesor hemije postaje narko-bos.',
       '2008-01-20',
       'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png',
       'Krimi','series',9.30,2500
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Breaking Bad' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Inception',
       'Krađa tajni iz podsvesti putem snova.',
       '2010-07-16',
       'https://upload.wikimedia.org/wikipedia/commons/d/db/The-matrix-logo.svg',
       'Sci-Fi','movie',8.70,1800
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Inception' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Dark Knight',
       'Batman se suočava sa Jokerom dok Gotham tone u haos.',
       '2008-07-18',
       'https://upload.wikimedia.org/wikipedia/commons/b/b0/The_Dark_Knight_Batman.jpg',
       'Akcija','movie',9.00,2200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Dark Knight' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Matrix',
       'Haker otkriva da je stvarnost simulacija i pridružuje se pobuni.',
       '1999-03-31',
       'https://upload.wikimedia.org/wikipedia/commons/d/db/The-matrix-logo.svg',
       'Sci-Fi','movie',8.70,2100
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Matrix' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Godfather',
       'Kronika mafijaške porodice Korleone.',
       '1972-03-24',
       'https://upload.wikimedia.org/wikipedia/commons/a/ad/The_Godfather_logo.svg',
       'Krimi','movie',9.20,2500
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Godfather' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Game of Thrones',
       'Plemićke kuće se bore za Gvozdeni presto.',
       '2011-04-17',
       'https://upload.wikimedia.org/wikipedia/commons/2/2e/Game_of_Thrones_2011_logo.svg',
       'Fantazija','series',8.90,3000
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Game of Thrones' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Stranger Things',
       'Deca iz Hokinsa nailaze na natprirodne pojave iz „Upside Down“.',
       '2016-07-15',
       'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png',
       'Sci-Fi','series',8.70,2800
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Stranger Things' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Friends',
       'Šestoro prijatelja živi i odrasta u Njujorku.',
       '1994-09-22',
       'https://upload.wikimedia.org/wikipedia/commons/b/bc/Friends_logo.svg',
       'Komedija','series',8.90,3200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Friends' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Mandalorian',
       'Lovac na ucene čuva dete iz vrste Jode u prostranstvima galaksije.',
       '2019-11-12',
       'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Mandalorian_logo.jpg',
       'Sci-Fi','series',8.60,1900
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Mandalorian' AND type='series');

-- 4) Epizode (bez duplikata)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT 2, 1, 1, 'Pilot', 'Walter White saznaje da ima rak i odlučuje da kuva metamfetamin.', 'bb_s1e1.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM Episodes
  WHERE content_id=2 AND season_number=1 AND episode_number=1
);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT 2, 1, 2, 'Cat''s in the Bag...', 'Walter i Jesse pokušavaju da se reše tela.', 'bb_s1e2.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM Episodes
  WHERE content_id=2 AND season_number=1 AND episode_number=2
);

-- 5) Trivia (bez duplikata po istom tekstu)
INSERT INTO Trivia (content_id, trivia_text)
SELECT 1, 'Film je sniman u Ohio State Reformatory.'
WHERE NOT EXISTS (
  SELECT 1 FROM Trivia WHERE content_id=1 AND trivia_text='Film je sniman u Ohio State Reformatory.'
);

INSERT INTO Trivia (content_id, trivia_text)
SELECT 2, 'Bryan Cranston je osvojio više Emmy nagrada za ovu ulogu.'
WHERE NOT EXISTS (
  SELECT 1 FROM Trivia WHERE content_id=2 AND trivia_text='Bryan Cranston je osvojio više Emmy nagrada za ovu ulogu.'
);

INSERT INTO Trivia (content_id, trivia_text)
SELECT 3, 'Za scenu nulte gravitacije korišćen je rotirajući hodnik.'
WHERE NOT EXISTS (
  SELECT 1 FROM Trivia WHERE content_id=3 AND trivia_text='Za scenu nulte gravitacije korišćen je rotirajući hodnik.'
);

-- Provera
SELECT COUNT(*) AS total_items FROM Content;
SELECT content_id,title,cover_image,type FROM Content ORDER BY title;
