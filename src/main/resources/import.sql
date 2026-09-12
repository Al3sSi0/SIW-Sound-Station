INSERT INTO artista(nome, data_nascita, id, img_url, nazionalita) values('Eminem', '17-10-1972', nextval('artista_seq'), 'https://www.inout-press.it/wp-content/uploads/2023/10/eminem.jpeg', 'Stati Uniti');
INSERT INTO artista(nome, data_nascita, id, img_url, nazionalita) values('50 Cent', '06-07-1975', nextval('artista_seq'), 'https://www.rapologia.it/wp-content/uploads/2023/01/50-Cent-Get-Rich-Or-Die-Tryin.jpeg', 'Stati Uniti');
INSERT INTO artista(nome, data_nascita, id, img_url, nazionalita) values('Vasco Rossi', '07-02-1952', nextval('artista_seq'), 'https://www.heyjudemagazine.it/wp-content/uploads/2020/05/vascorossi.png', 'Italia');
INSERT INTO artista(nome, data_nascita, id, img_url, nazionalita) values('Beyoncé', '04-09-1981', nextval('artista_seq'), 'https://cdn.britannica.com/59/204159-050-5055F2A9/Beyonce-2013.jpg', 'Stati Uniti');

INSERT INTO album(nome, anno, id, img_url, autore_id) values('The Eminem Show', '2002', nextval('album_seq'),'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4', (SELECT id FROM artista WHERE nome = 'Eminem' LIMIT 1));
INSERT INTO album(nome, anno, id, img_url, autore_id) values('Get Rich or Die Tryn', '2003', nextval('album_seq'),'https://cdn-images.dzcdn.net/images/cover/8f4dd4d8abf85ceda96b6b4adf217590/0x1900-000000-80-0-0.jpg', (SELECT id FROM artista WHERE nome = '50 Cent' LIMIT 1));

INSERT INTO brano(nome, anno, id, img_url, genere, autore_id, album_id, durata) values('Without Me', '2002', nextval('brano_seq'),'', 'rap', (SELECT id FROM artista WHERE nome = 'Eminem' LIMIT 1), (SELECT id FROM album WHERE nome = 'The Eminem Show' LIMIT 1), 274000000000);
INSERT INTO brano(nome, anno, id, img_url, genere, autore_id, album_id, durata) values('Stan', '2000', nextval('brano_seq'),'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBPUgilnxwvyKdZTEDbnzcUVXE-IZGcTRzUA&s', 'rap', (SELECT id FROM artista WHERE nome = 'Eminem' LIMIT 1), null, 274000000000);

INSERT INTO users(name, surname, id, email) values('Ale', 'Figo', nextval('users_seq'), 'ale@gmail,com');
INSERT INTO credentials(username, password, id, user_id, role) values('Figo99', '$2a$12$8ZuerFOOBFoPg506Qt9v9.lT/S6Ybf3hEI/6nTSFlQfV8bIPcv4QC', nextval('credentials_seq'), (SELECT id FROM users WHERE name = 'Ale' LIMIT 1),'ADMIN');

INSERT INTO users(name, surname, id, email) values('Al', 'Fig', nextval('users_seq'), 'al@gmail,com');
INSERT INTO credentials(username, password, id, user_id, role) values('Figo98', '$2a$12$rmugXT02GjKxK8LbHHT7ou3wDRjlDQRcZcoB37fIvNm6fl9sVkSN6', nextval('credentials_seq'), (SELECT id FROM users WHERE name = 'Al' LIMIT 1),'DEFAULT');