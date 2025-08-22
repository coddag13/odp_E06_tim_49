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

-- 3) Sadržaj (filmovi + serije) sa posterima

-- FILMOVI
INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Shawshank Redemption',
       'Nepravedno osuđen bankar provodi decenije iza rešetaka, sklapajući neočekivano prijateljstvo i tiho planirajući izlaz. Film gradi nadu, dostojanstvo i istrajnost u najtežim okolnostima.',
       '1994-09-22',
       'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg',
       'Drama','movie',9.50,1200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Shawshank Redemption' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Inception',
       'Tim specijalista ulazi u snove kako bi izveo gotovo nemoguću misiju – usađivanje ideje. Spektakl koji kombinuje akciju, psihologiju i slojeve realnosti u inovativnoj naraciji.',
       '2010-07-16',
       'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
       'Sci-Fi','movie',8.70,1800
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Inception' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Dark Knight',
       'Batman se suočava sa anarhičnim Jokerom dok Gotham tone u haos. Mračni superheroj film koji postavlja standarde za žanr i istražuje krhkost morala u ekstremnim uslovima.',
       '2008-07-18',
       'https://upload.wikimedia.org/wikipedia/commons/b/b0/The_Dark_Knight_Batman.jpg',
       'Akcija','movie',9.00,2200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Dark Knight' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Matrix',
       'Haker otkriva da je njegova stvarnost simulacija i pridružuje se pobuni protiv mašina. Ikonični vizuelni stil, filozofske ideje i redefinisanje akcionog filma.',
       '1999-03-31',
       'https://resizing.flixster.com/vQPZM_fQCjrk1MByVMdJsKZEXIA=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p22804_v_h6_am.jpg',
       'Sci-Fi','movie',8.70,2100
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Matrix' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Godfather',
       'Epska saga o porodici Korleone prikazuje moć, lojalnost i cenu kriminalnog nasleđa. Film je sinonim za majstorstvo naracije i nezaboravne likove.',
       '1972-03-24',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
       'Krimi','movie',9.20,2500
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Godfather' AND type='movie');

-- Novi filmovi
INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Pulp Fiction',
       'Ne-linearni mozaik kriminalnih priča u Los Anđelesu isprepliće humor, nasilje i pop-kulturne reference. Kultni dijalozi i stil koji je definisao epohu.',
       '1994-10-14',
       'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg',
       'Krimi','movie',8.90,2100
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Pulp Fiction' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Interstellar',
       'Pilot i tim naučnika kreću kroz crvotočinu u potrazi za novim domom za čovečanstvo, spajajući porodičnu dramu sa kosmičkim idejama i relativnošću vremena.',
       '2014-11-07',
       'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
       'Sci-Fi','movie',8.60,2000
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Interstellar' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Fight Club',
       'Korporativno otuđenje, haos i identitet sudaraju se u priči o tajnom klubu i njegovim radikalnim pravilima. Provokativan komentar o potrošačkom društvu.',
       '1999-10-15',
       'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg',
       'Drama','movie',8.80,1900
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Fight Club' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Forrest Gump',
       'Život dobrodušnog Forresta prati ključne trenutke američke istorije, dok ljubav, slučajnost i istrajnost oblikuju njegov nesvakidašnji put.',
       '1994-07-06',
       'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
       'Drama','movie',8.80,2300
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Forrest Gump' AND type='movie');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Parasite',
       'Satirični triler o dve porodice različitih klasa, čiji se životi prepliću neočekivanim obrtima. Oštar komentar o nejednakosti i ambiciji.',
       '2019-05-30',
       'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
       'Triler','movie',8.60,1500
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Parasite' AND type='movie');

-- SERIJE (posteri / naslovne slike po sezoni/seriji)
INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Breaking Bad',
       'Skromni profesor hemije okreće se kriminalu nakon lične krize, što pokreće vrtlog moralnih dilema, opasnosti i transformacije. Serija je poznata po likovima, tenziji i razvoju priče.',
       '2008-01-20',
       'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Breaking_Bad_logo.svg/375px-Breaking_Bad_logo.svg.png',
       'Krimi','series',9.30,2500
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Breaking Bad' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Game of Thrones',
       'Plemićke kuće Zapadosa bore se za presto u svetu gde su politika i izdaje jednako smrtonosne kao i zmajevi. Serija poznata po ambiciji, šokovima i opsegu.',
       '2011-04-17',
       'https://upload.wikimedia.org/wikipedia/commons/2/2e/Game_of_Thrones_2011_logo.svg',
       'Fantazija','series',8.90,3000
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Game of Thrones' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Stranger Things',
       'Skupina dece iz Hokinsa suočava se s natprirodnim fenomenima i tajnim eksperimentima dok se otvara portal u “Upside Down”. Retrowave estetika i srce osamdesetih.',
       '2016-07-15',
       'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png',
       'Sci-Fi','series',8.70,2800
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Stranger Things' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Friends',
       'Šestoro prijatelja u Njujorku prolazi kroz uspone i padove karijera, ljubavi i odrastanja. Serija koja je redefinisala sitkom format svojim humorom i toplinom.',
       '1994-09-22',
       'https://upload.wikimedia.org/wikipedia/commons/b/bc/Friends_logo.svg',
       'Komedija','series',8.90,3200
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Friends' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Mandalorian',
       'Usamljeni lovac na ucene kreće u avanturu čuvanja tajanstvenog deteta kroz daleke delove galaksije. Star Wars priča sa fokusom na likove i atmosferu.',
       '2019-11-12',
       'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Mandalorian.svg/500px-The_Mandalorian.svg.png',
       'Sci-Fi','series',8.60,1900
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Mandalorian' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Witcher',
       'Veštac Geralt, usamljeni lovac na čudovišta, sudbinski je povezan sa moćnim likovima u svetu magije, politike i mitologije. Tamna fantazija sa moralnim nijansama.',
       '2019-12-20',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png',
       'Fantazija','series',8.10,900
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Witcher' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'Westworld',
       'Tematski park sa androidima pretvara se u poligon za pitanja svesti, slobodne volje i moći. Ambiciozna SF serija sa kompleksnim narativom.',
       '2016-10-02',
       'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Westworld_%28TV_series%29_title_card.jpg/375px-Westworld_%28TV_series%29_title_card.jpg',
       'Sci-Fi','series',8.60,1100
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='Westworld' AND type='series');

INSERT INTO Content
  (title, description, release_date, cover_image, genre, type, average_rating, rating_count)
SELECT 'The Crown',
       'Hronika vladavine kraljice Elizabete II, koja spaja lične dileme i političke izazove krune kroz decenije britanske istorije.',
       '2016-11-04',
       'https://upload.wikimedia.org/wikipedia/en/thumb/1/18/The_Crown_Title_Card.jpg/375px-The_Crown_Title_Card.jpg',
       'Drama','series',8.60,1000
WHERE NOT EXISTS (SELECT 1 FROM Content WHERE title='The Crown' AND type='series');

-- 4) Epizode — koristimo postere 1. sezone kao cover za svaku
-- BREAKING BAD (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'Pilot', 'Walter saznaje dijagnozu i pravi sudbonosnu odluku koja menja njegov život.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c
WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'Cat''s in the Bag...', 'Walter i Jesse pokušavaju da prikriju tragove, što vodi ka novim problemima.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, '...And the Bag''s in the River', 'Ulog raste dok Walt balansira porodični život i opasni posao.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Cancer Man', 'Otkrivaju se detalji o Waltovoj bolesti i posledice njegovih odluka.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'Gray Matter', 'Prošlost kuca na vrata, nudeći Walatu izlaz — uz visoku cenu po ponos.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'Crazy Handful of Nothin''', 'Walter pravi hrabar potez i otkriva novu, mračniju stranu sebe.',
       'https://upload.wikimedia.org/wikipedia/en/6/61/BreakingBadS1DVD.jpg'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- GAME OF THRONES (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'Winter Is Coming', 'Starkovi dobijaju poziv u Kraljevu luku; sumnje i tajne rastu na severu.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'The Kingsroad', 'Putovanja menjaju sudbine; opasnosti vrebaju iz senki i kuća rivala.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'Lord Snow', 'Intrige na dvoru i izazovi na Zidu oblikuju nove saveze i neprijateljstva.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Cripples, Bastards, and Broken Things', 'Vitezovi, zmajevi i tajne prošlosti — svi imaju deo u igri prestola.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'The Wolf and the Lion', 'Sukobi eskaliraju, lojalnosti se preispituju, a planovi se zaoštravaju.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'A Golden Crown', 'Krune i izdaje ne dolaze besplatno; cena moći se naplaćuje brzo.',
       'https://upload.wikimedia.org/wikipedia/en/e/e8/Game_of_Thrones_Season_1.jpg'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- STRANGER THINGS (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'The Vanishing of Will Byers', 'Nestanak dečaka pokreće lavinu misterija i susreta s nepoznatim svetom.',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'The Weirdo on Maple Street', 'Tajanstvena devojčica i tragovi eksperimenata bude sumnje u gradu.',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'Holly, Jolly', 'Napetost raste; telefon zvoni iz drugog sveta, a istina isplivava.',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'The Body', 'Očaj i nada sudaraju se dok prijatelji traže nestalog druga.',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'The Flea and the Acrobat', 'Fizika kao ključ: kako preći između svetova i šta time rizikujemo?',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'The Monster', 'Nevidljiva pretnja dobija oblik; prijateljstvo i hrabrost polažu ispit.',
       'https://upload.wikimedia.org/wikipedia/en/b/b1/Stranger_Things_season_1.jpg'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- FRIENDS (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'The One Where Monica Gets a Roommate', 'Početak prijateljstva uz humor, iznenađenja i povratke bivših ljubavi.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'The One with the Sonogram at the End', 'Neočekivane vesti i komične reakcije testiraju odnose grupe.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'The One with the Thumb', 'Čudne navike i srećne koincidencije donose nova komična otkrića.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'The One with George Stephanopoulos', 'Noćni izlazak pretvara se u niz urnebesnih situacija i ispovesti.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'The One with the East German Laundry Detergent', 'Partnerstva na testu — i u ljubavi i u praonici veša.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'The One with the Butt', 'Novo iskustvo u glumi i romanse sa neočekivanim obrtima.',
       'https://upload.wikimedia.org/wikipedia/en/1/1c/Friends_Season_1_DVD.jpg'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- THE MANDALORIAN (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'Chapter 1: The Mandalorian', 'Lovac dobija zadatak koji menja njegov put i principe.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'Chapter 2: The Child', 'Neočekivana briga i odbrana otkrivaju drugu stranu lovca.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'Chapter 3: The Sin', 'Odluka između koda i savesti donosi velike posledice.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Chapter 4: Sanctuary', 'Potraga za mirom vodi u novu bitku i savezništva.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'Chapter 5: The Gunslinger', 'Stari zakoni pustinje i novi igrači menjaju tok misije.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'Chapter 6: The Prisoner', 'Pljačka u svemiru otkriva pravu prirodu posade i poverenja.',
       'https://upload.wikimedia.org/wikipedia/en/0/04/The_Mandalorian_season_1_poster.jpg'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- THE WITCHER (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'The End''s Beginning', 'Geralt donosi teške odluke u svetu punom čudovišta i politike.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'Four Marks', 'Sudar sudbina i traganje za identitetom oblikuju odanosti.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'Betrayer Moon', 'Lov na čudovište otkriva mračne tajne i prokletstva.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Of Banquets, Bastards and Burials', 'Političke igre i staro proročanstvo utiču na sudbine junaka.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'Bottled Appetites', 'Magija i moralni izbori se ukrštaju u neočekivanim savezima.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'Rare Species', 'Lov vodi u nepoznato, a istina se pokazuje složenijom od mita.',
       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/The_Witcher_Logo.png/500px-The_Witcher_Logo.png'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- WESTWORLD (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'The Original', 'Park savršenstva skriva pukotine svesti i programiranih sećanja.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'Chestnut', 'Novi posetioci, stari obrasci — granica igre i stvarnosti bledi.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'The Stray', 'Nestali host otkriva veću zagonetku dizajna i namere kreatora.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Dissonance Theory', 'Putevi junaka i narativi parka se ukrštaju u opasnim misijama.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'Contrapasso', 'Moralne granice posetilaca i hostova postaju sve tanje i opasnije.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'The Adversary', 'Sumnje se potvrđuju; sistemi i ljudi pokazuju skrivene agende.',
       'https://upload.wikimedia.org/wikipedia/en/2/28/Westworld_season_1.png'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- THE CROWN (S01E01–E06)
INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 1, 'Wolferton Splash', 'Mladi brak, velika odgovornost: početak vladavine Elizabete II.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=1);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 2, 'Hyde Park Corner', 'Smrt kralja menja tok zemlje; kruna ne trpi prazninu trona.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=2);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 3, 'Windsor', 'Simboli monarhije, porodica i država ulaze u tenzičnu ravnotežu.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=3);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 4, 'Act of God', 'Smog katastrofa testira lidere i legitimitet odluka u krizi.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=4);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 5, 'Smoke and Mirrors', 'Kruna i ceremonija — tradicija kao politički instrument moći.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=5);

INSERT INTO Episodes (content_id, season_number, episode_number, title, description, cover_image)
SELECT c.content_id, 1, 6, 'Gelignite', 'Privatne želje sudaraju se s javnim dužnostima i očekivanjima.',
       'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Episodes e WHERE e.content_id=c.content_id AND e.season_number=1 AND e.episode_number=6);

-- 5) TRIVIA – 3 zanimljivosti za SVAKI naslov (bez duplikata po istom tekstu)

-- THE SHAWSHANK REDEMPTION
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Zatvor u filmu inspirisan je stvarnim Ohio State Reformatory objektom.'
FROM Content c WHERE c.title='The Shawshank Redemption' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Zatvor u filmu inspirisan je stvarnim Ohio State Reformatory objektom.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je postepeno stekao kultni status kroz TV prikazivanja i video izdanja.'
FROM Content c WHERE c.title='The Shawshank Redemption' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je postepeno stekao kultni status kroz TV prikazivanja i video izdanja.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Teme nade i prijateljstva često se navode kao razlog dugotrajne popularnosti.'
FROM Content c WHERE c.title='The Shawshank Redemption' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Teme nade i prijateljstva često se navode kao razlog dugotrajne popularnosti.');

-- BREAKING BAD
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Bryan Cranston je višestruko nagrađivan za ulogu Waltera Whitea.'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Bryan Cranston je višestruko nagrađivan za ulogu Waltera Whitea.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je poznata po detaljnoj simbolici boja i vizuelnim motivima.'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je poznata po detaljnoj simbolici boja i vizuelnim motivima.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Mnoge lokacije snimane su u Novom Meksiku, što je oblikovalo estetiku serije.'
FROM Content c WHERE c.title='Breaking Bad' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Mnoge lokacije snimane su u Novom Meksiku, što je oblikovalo estetiku serije.');

-- INCEPTION
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Prepoznatljiva muzika Hansa Zimmera naglašava slojeve sna i vremena.'
FROM Content c WHERE c.title='Inception' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Prepoznatljiva muzika Hansa Zimmera naglašava slojeve sna i vremena.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Praktični efekti (poput rotirajućeg hodnika) korišćeni su za ključne scene.'
FROM Content c WHERE c.title='Inception' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Praktični efekti (poput rotirajućeg hodnika) korišćeni su za ključne scene.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je često predmet debata o otvorenom završetku.'
FROM Content c WHERE c.title='Inception' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je često predmet debata o otvorenom završetku.');

-- THE DARK KNIGHT
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Heath Ledgerova interpretacija Jokera stekla je legendarni status.'
FROM Content c WHERE c.title='The Dark Knight' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Heath Ledgerova interpretacija Jokera stekla je legendarni status.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je značajno koristio IMAX kamere za spektakularne sekvence.'
FROM Content c WHERE c.title='The Dark Knight' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je značajno koristio IMAX kamere za spektakularne sekvence.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Moralne dileme i haos teme su koje film temeljno istražuje.'
FROM Content c WHERE c.title='The Dark Knight' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Moralne dileme i haos teme su koje film temeljno istražuje.');

-- THE MATRIX
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Poznati “bullet time” efekat uticao je na čitav akcioni žanr.'
FROM Content c WHERE c.title='The Matrix' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Poznati “bullet time” efekat uticao je na čitav akcioni žanr.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Inspirisan filozofijom, cyberpunkom i istočnjačkim borilačkim veštinama.'
FROM Content c WHERE c.title='The Matrix' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Inspirisan filozofijom, cyberpunkom i istočnjačkim borilačkim veštinama.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Motiv crvene i plave pilule postao je ikoničan u pop kulturi.'
FROM Content c WHERE c.title='The Matrix' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Motiv crvene i plave pilule postao je ikoničan u pop kulturi.');

-- THE GODFATHER
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je adaptacija romana Marija Puza i redefinisao je gangsterski žanr.'
FROM Content c WHERE c.title='The Godfather' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je adaptacija romana Marija Puza i redefinisao je gangsterski žanr.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Marlon Brando i Al Paćino doneli su nezaboravne interpretacije.'
FROM Content c WHERE c.title='The Godfather' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Marlon Brando i Al Paćino doneli su nezaboravne interpretacije.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Motivi porodične lojalnosti i moći su u srži narativa.'
FROM Content c WHERE c.title='The Godfather' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Motivi porodične lojalnosti i moći su u srži narativa.');

-- GAME OF THRONES
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je adaptacija romana “Pesma leda i vatre” Džordža R. R. Martina.'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je adaptacija romana “Pesma leda i vatre” Džordža R. R. Martina.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Poznata je po neočekivanim obrtima i spremnosti da rizikuje sa glavnim likovima.'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Poznata je po neočekivanim obrtima i spremnosti da rizikuje sa glavnim likovima.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Snimana je na više kontinenata, što je doprinelo epici i autentičnosti.'
FROM Content c WHERE c.title='Game of Thrones' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Snimana je na više kontinenata, što je doprinelo epici i autentičnosti.');

-- STRANGER THINGS
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Inspirisana filmovima i kulturom osamdesetih, uz snažan retro ambijent.'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Inspirisana filmovima i kulturom osamdesetih, uz snažan retro ambijent.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Lik Eleven postao je simbol misterije i otkrivanja moći.'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Lik Eleven postao je simbol misterije i otkrivanja moći.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je ujedinila horor, avanturu i dramu uz snažan fokus na prijateljstvo.'
FROM Content c WHERE c.title='Stranger Things' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je ujedinila horor, avanturu i dramu uz snažan fokus na prijateljstvo.');

-- FRIENDS
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Jedan od najpopularnijih sitkoma, prepoznatljiv po humoru i hemiji glumačke postave.'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Jedan od najpopularnijih sitkoma, prepoznatljiv po humoru i hemiji glumačke postave.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Central Perk i “sofa” postali su ikonični elementi pop kulture.'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Central Perk i “sofa” postali su ikonični elementi pop kulture.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je ostala trajan simbol devedesetih i ranih dvehiljaditih.'
FROM Content c WHERE c.title='Friends' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je ostala trajan simbol devedesetih i ranih dvehiljaditih.');

-- THE MANDALORIAN
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je proslavila lika “The Child / Grogu”, koji je postao globalni fenomen.'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je proslavila lika “The Child / Grogu”, koji je postao globalni fenomen.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Inovativne LED pozadine (StageCraft) redefinisale su način snimanja.'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Inovativne LED pozadine (StageCraft) redefinisale su način snimanja.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Muzika Ludwiga Göranssona doprinela je prepoznatljivoj atmosferi.'
FROM Content c WHERE c.title='The Mandalorian' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Muzika Ludwiga Göranssona doprinela je prepoznatljivoj atmosferi.');

-- PULP FICTION
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je poznat po ne-linearnom pripovedanju i kultnim dijalozima.'
FROM Content c WHERE c.title='Pulp Fiction' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je poznat po ne-linearnom pripovedanju i kultnim dijalozima.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Quentin Tarantino isprepleo je više žanrova i referenci u jedinstvenu celinu.'
FROM Content c WHERE c.title='Pulp Fiction' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Quentin Tarantino isprepleo je više žanrova i referenci u jedinstvenu celinu.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Soundtrack igra ključnu ulogu u tonu i ritmu filma.'
FROM Content c WHERE c.title='Pulp Fiction' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Soundtrack igra ključnu ulogu u tonu i ritmu filma.');

-- INTERSTELLAR
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Konzultovan je fizičar Kip Torn, što je doprinelo naučnoj utemeljenosti.'
FROM Content c WHERE c.title='Interstellar' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Konzultovan je fizičar Kip Torn, što je doprinelo naučnoj utemeljenosti.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Vizuelizacija crne rupe “Gargantua” kombinovala je umetnost i nauku.'
FROM Content c WHERE c.title='Interstellar' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Vizuelizacija crne rupe “Gargantua” kombinovala je umetnost i nauku.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Muzika orgulja naglašava motiv vremena i beskraja.'
FROM Content c WHERE c.title='Interstellar' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Muzika orgulja naglašava motiv vremena i beskraja.');

-- FIGHT CLUB
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Film je adaptacija romana Chucka Palahniuka i izazvao je brojne debate.'
FROM Content c WHERE c.title='Fight Club' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Film je adaptacija romana Chucka Palahniuka i izazvao je brojne debate.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Režija Davida Finchera donela je prepoznatljiv mračni vizuelni stil.'
FROM Content c WHERE c.title='Fight Club' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Režija Davida Finchera donela je prepoznatljiv mračni vizuelni stil.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Mnoge rečenice iz filma postale su fraze u pop kulturi.'
FROM Content c WHERE c.title='Fight Club' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Mnoge rečenice iz filma postale su fraze u pop kulturi.');

-- FORREST GUMP
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Digitalni efekti korišćeni su za ugradnju Forresta u istorijske snimke.'
FROM Content c WHERE c.title='Forrest Gump' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Digitalni efekti korišćeni su za ugradnju Forresta u istorijske snimke.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Tom Hanks je uneo nežnost i iskrenost koje su naterale publiku da ga zavoli.'
FROM Content c WHERE c.title='Forrest Gump' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Tom Hanks je uneo nežnost i iskrenost koje su naterale publiku da ga zavoli.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Motivi slučajnosti i sudbine prožimaju film od početka do kraja.'
FROM Content c WHERE c.title='Forrest Gump' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Motivi slučajnosti i sudbine prožimaju film od početka do kraja.');

-- PARASITE
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Prvi južnokorejski film koji je osvojio Oskara za najbolji film.'
FROM Content c WHERE c.title='Parasite' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Prvi južnokorejski film koji je osvojio Oskara za najbolji film.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Režiser Bong Joon-ho kombinuje crni humor, triler i društvenu satiru.'
FROM Content c WHERE c.title='Parasite' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Režiser Bong Joon-ho kombinuje crni humor, triler i društvenu satiru.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Arhitektura kuće je dizajnirana da simboliše klasne razlike.'
FROM Content c WHERE c.title='Parasite' AND c.type='movie'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Arhitektura kuće je dizajnirana da simboliše klasne razlike.');

-- THE WITCHER
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija je zasnovana na knjigama Andžeja Sapkovskog, popularnim širom sveta.'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija je zasnovana na knjigama Andžeja Sapkovskog, popularnim širom sveta.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Značajan uticaj imala je i popularnost video-igara iz istog univerzuma.'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Značajan uticaj imala je i popularnost video-igara iz istog univerzuma.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Muzika i scenografija stvaraju prepoznatljivu, tamnu fantazijsku atmosferu.'
FROM Content c WHERE c.title='The Witcher' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Muzika i scenografija stvaraju prepoznatljivu, tamnu fantazijsku atmosferu.');

-- WESTWORLD
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Nadovezuje se na istoimeni film iz 1973. i proširuje njegove ideje.'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Nadovezuje se na istoimeni film iz 1973. i proširuje njegove ideje.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Kombinuje filozofiju, psihologiju i SF u istraživanju svesti.'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Kombinuje filozofiju, psihologiju i SF u istraživanju svesti.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Vizuelni identitet i muzika (Ramin Djawadi) posebno su zapaženi.'
FROM Content c WHERE c.title='Westworld' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Vizuelni identitet i muzika (Ramin Djawadi) posebno su zapaženi.');

-- THE CROWN
INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Velika pažnja posvećena je kostimima i istorijskoj tačnosti detalja.'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Velika pažnja posvećena je kostimima i istorijskoj tačnosti detalja.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Serija koristi višesezonsku podelu glumačke postave po decenijama.'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Serija koristi višesezonsku podelu glumačke postave po decenijama.');

INSERT INTO Trivia (content_id, trivia_text)
SELECT c.content_id, 'Odnosi unutar kraljevske porodice prikazani su kroz emotivne nijanse i protok vremena.'
FROM Content c WHERE c.title='The Crown' AND c.type='series'
AND NOT EXISTS (SELECT 1 FROM Trivia t WHERE t.content_id=c.content_id AND t.trivia_text='Odnosi unutar kraljevske porodice prikazani su kroz emotivne nijanse i protok vremena.');

-- Provera
SELECT COUNT(*) AS total_items FROM Content;
SELECT content_id, title, cover_image, genre, type FROM Content ORDER BY title;
