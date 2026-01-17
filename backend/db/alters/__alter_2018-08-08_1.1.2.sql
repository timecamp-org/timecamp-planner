
--
-- ALTER: 1.1.1
-- DATE: 2018-08-08
-- FEATURES: 
-- * fixed sample sapce not created after adding container_id
--


\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.1.1';
  newVersion text = '1.1.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  create OR REPLACE function "project-management".create_sample_space(sample_project_id uuid, organization_id uuid, bot_id uuid, project_start_date timestamp with time zone)
    returns void
  language plpgsql
  as $inner$
  DECLARE
    tag_helios_id     UUID := uuid_generate_v4();
    tag_sol_id        UUID := uuid_generate_v4();
    tag_hermes_id     UUID := uuid_generate_v4();
    tag_gaea_id       UUID := uuid_generate_v4();
    tag_ares_id       UUID := uuid_generate_v4();
    tag_aphrodite_id  UUID := uuid_generate_v4();
    tag_kukulcan_id   UUID := uuid_generate_v4();
    tag_jupiter_id    UUID := uuid_generate_v4();
    tag_zeus_id       UUID := uuid_generate_v4();
    tag_cronus_id     UUID := uuid_generate_v4();
    tag_neptune_id    UUID := uuid_generate_v4();
    tag_poseidon_id   UUID := uuid_generate_v4();
    tag_hades_id      UUID := uuid_generate_v4();

    list_1_id         UUID := uuid_generate_v4();
    list_2_id         UUID := uuid_generate_v4();
    list_3_id         UUID := uuid_generate_v4();
    list_4_id         UUID := uuid_generate_v4();


    task_mars_id      UUID := uuid_generate_v4();
    task_sun_id       UUID := uuid_generate_v4();
    task_mercury_id   UUID := uuid_generate_v4();
    task_earth_id     UUID := uuid_generate_v4();
    task_venus_id     UUID := uuid_generate_v4();
    task_jupiter_id   UUID := uuid_generate_v4();
    task_saturn_id    UUID := uuid_generate_v4();
    task_uranus_id    UUID := uuid_generate_v4();
    task_neptune_id   UUID := uuid_generate_v4();
    task_pluto_id     UUID := uuid_generate_v4();

    file_1_id         UUID := uuid_generate_v4();
    file_2_id         UUID := uuid_generate_v4();
    file_3_id         UUID := uuid_generate_v4();
    file_4_id         UUID := uuid_generate_v4();
    file_5_id         UUID := uuid_generate_v4();
    file_6_id         UUID := uuid_generate_v4();

    message_1_id      UUID := uuid_generate_v4();
    message_2_id      UUID := uuid_generate_v4();
    message_3_id      UUID := uuid_generate_v4();
    message_4_id      UUID := uuid_generate_v4();
    message_5_id      UUID := uuid_generate_v4();
    message_6_id      UUID := uuid_generate_v4();
    message_7_id      UUID := uuid_generate_v4();
    message_8_id      UUID := uuid_generate_v4();
    message_9_id      UUID := uuid_generate_v4();
    message_10_id     UUID := uuid_generate_v4();
    message_11_id     UUID := uuid_generate_v4();
    message_12_id     UUID := uuid_generate_v4();
    message_13_id     UUID := uuid_generate_v4();
    message_14_id     UUID := uuid_generate_v4();
    message_15_id     UUID := uuid_generate_v4();
    message_16_id     UUID := uuid_generate_v4();

  BEGIN
    -- Demo project
    INSERT INTO "project-management".project (
        id,
        organization_id,
        status,
        name,
        description,
        project_type,
        creator_id,
        is_private,
        is_archived,
        color,
        start_date,
        due_date,
        auto_join
        ) VALUES (
                     sample_project_id,
                     organization_id,
                     'exists',
                     'Demo space',
                     '',
                     'project',
                     bot_id,
                     false,
                     false,
                     '#7850fc',
                     project_start_date,
                     null,
                     true
                     );

    -- Tags in organization
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_helios_id, 'Helios', organization_id, '#d9dea6');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_sol_id, 'Sol', organization_id, '#fccda3');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_hermes_id, 'Hermes', organization_id, '#ffd670');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_gaea_id, 'Gaea', organization_id, '#d3c4f7');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_ares_id, 'Ares', organization_id, '#4ed3aa');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_aphrodite_id, 'Aphrodite', organization_id, '#ff9770');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_kukulcan_id, 'Kukulcan', organization_id, '#fccda3');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_jupiter_id, 'Jupiter', organization_id, '#4ed3aa');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_zeus_id, 'Zeus', organization_id, '#ff9770');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_cronus_id, 'Cronus', organization_id, '#7e97ff');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_neptune_id, 'Neptune', organization_id, '#eeff93');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_poseidon_id, 'Poseidon', organization_id, '#d9dea6');
    INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_hades_id, 'Hades', organization_id, '#d3c4f7');

    -- Task lists in demo project
    INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_1_id, sample_project_id, 1, 'Stars', false, bot_id);
    INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_2_id, sample_project_id, 2, 'Rocky Planets', false, bot_id);
    INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_3_id, sample_project_id, 4, 'Gas Giants', false, bot_id);
    INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_4_id, sample_project_id, 8, 'Dwarf Planet', false, bot_id);

    -- Tasks (planets)
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_mars_id, sample_project_id, 'Mars - the fourth planet from the Sun, called as the "Red Planet"', 4, '{"ops":[{"insert":"The planet "},{"attributes":{"header":2},"insert":"\n"},{"insert":"Mild temperament on Mars is more like the Earth''s than any of the other planets. Mars have had rivers, ocean and lakes. Today the only water on Mars is either frozen in the polar caps or underground. \nWe call Mars the Red Planet because of it''s red surface. Surface color comes from high amount of Iron.\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Mars was the Roman god of war and agriculture. Mars gives protection to those who fought or theis communities and stayed home to raise crops for food. In Greek mythology, Mars was called "},{"attributes":{"bold":true},"insert":"Ares"},{"insert":".\n\nMoons"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Deimos "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Phobos"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_2_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_sun_id, sample_project_id, 'The Sun -  star at the center of the Solar System', 1, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"The Sun was born around "},{"attributes":{"background":"#cce0f5","bold":true},"insert":"5 billion "},{"insert":"years ago in a vast cloud of gas and dust. \nOur Sun is not unique in the universe. It is a middle-sized yellow star. Ancient Romans used word \"Sol\" which meant Sun in their language. This is the reason why we call our star system - the Solar system. We have got trillions of other stars spread multiple galaxies. Many of them have their own system of planets with moons, comets and asteroids.\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In ancient Greece, the sun was called "},{"attributes":{"bold":true},"insert":"Helios"},{"insert":".\n\n"}]}', list_1_id, bot_id, false, 'incomplete', 25, '2018-07-26 10:00:00.000000', null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_mercury_id, sample_project_id, 'Mercury - the closest planet to the Sun', 1, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Mercury is the closest planet to the Sun. It is possible to observe Mercury from Earth in late evening or early morning sky. We often call Mercury a "},{"attributes":{"background":"#ffffcc","bold":true},"insert":"Morning Star"},{"insert":" because Mercury shines brightest in the early morning, just before the sun rises. \nMercury is a little bigger than our moon. Mercury is too small and has too little gravity to have an atmosphere. \n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In Roman Mythology Mercury was a counterpart of Greek God "},{"attributes":{"background":"#ffffcc","bold":true},"insert":"Hermes"},{"insert":". His main job was to deliver messages between gods. He was often depicted wearing a winged hat and winged sandals. Mercury was a patron of merchants and all types of travellers.\n\n"}]}', list_2_id, bot_id, false, 'incomplete', 50, '2018-07-11 10:00:00.000000', null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_earth_id, sample_project_id, 'Earth - the closest planet to the sun, the only planet in our solar system known to harbor living things.', 2, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"The Earth is the biggest terrestrial planet in our star system. The diameter of Earth is 7,926 miles. The circumference measured around the equator is 24,901 miles. On the Earth lives around 7 billion people. About 70% of the Earth is covered by oceans and around 30% is covered with land. \n\n"},{"attributes":{"header":2},"insert":"\n"},{"insert":"\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Greek name for Earth was "},{"attributes":{"bold":true},"insert":"Gaea"},{"insert":". In Greek''s mythology Earth was the mother of all mountains, valleys and all kind of land formations. Gaea was married to Uranus. \n"},{"attributes":{"align":"justify"},"insert":"\n"},{"insert":"Moons"},{"attributes":{"align":"justify"},"insert":"\n"},{"insert":"Luna"},{"attributes":{"align":"justify","list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_2_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_venus_id, sample_project_id, 'Venus - the second planet from the Sun, called Earth''s "Sister Planet"', 8, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Venus is about 7,521 miles (12,104 kilometers) in diameter. It is the second planet from the Sun. It takes 225 Earth days to go around the Sun. \nVenus is covered with lava plains, mountains, volcanoes and craters. The highest point on Venus is called Maxwell Montes. It is more than 7 miles (11 km) high.The planet''s atmosphere is ninety times heavier than Earth''s. \nVenus is the hottest planet in the Solar System. Surface temperature can get close to 900° F (482° C).\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In Roman mythology, Venus was identified with "},{"attributes":{"bold":true},"insert":"Aphrodite "},{"insert":"- the goddess of love and beauty. The ancient Mayans, called Venus as a "},{"attributes":{"bold":true},"insert":"Kukulcan"},{"insert":". She was the patron of warfare or the feathered serpent.\n\n"}]}', list_2_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_jupiter_id, sample_project_id, 'Jupiter -  fifth planet from the Sun and the largest in the Solar System', 1, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Jupiter is the fifth planet from the Sun. It is also the biggest planet in Solar System. It has a diameter of 89,000 miles (143,000 kilometers). Eleven Earths would fit side by side across the face of Jupiter. Jupiter need 12 Earth''s years to go around the Sun. Day on Jupiter lasts for about 10 hours.\nJupiter''s atmosphere is mostly made by hydrogen (86 %) and helium (14 %). Average temperature is around 244° F (–153° C).\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In Roman mythology, Jupiter was the king of the gods and lord of the sky.\n\nMoons"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Jupiter has 63 moons."},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_3_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_saturn_id, sample_project_id, 'Saturn - the sixth planet from the Sun,  the second-largest in the Solar System', 2, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Saturn is the sixth planet from the Sun. It is a second-largest planet in Solar System. Saturn is 9 and half times bigger than Earth. Saturns Solar Year takes 29,4 Earth''s Years  and only 11 hours to spin on its axis. The atmosphere of this ringed planet is like Jupiter''s atmosphere. Saturn holds mostly hydrogen (97 %) and helium (3 %). Saturn has a ring system made up of ice and rock particles, some as big as a minivan. The average temperature on Saturn is\n–300° F (–184° C).\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In Roman mythology, Saturn is a god of the harvest. He is also a father of Jupiter. In a Greek mythology he is identified with a god called Cronus. \n\nMoons"},{"attributes":{"header":2},"insert":"\n"},{"insert":"There are 47 moons orbiting Saturn."},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_3_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_uranus_id, sample_project_id, 'Uranus -  the seventh planet from the Sun, it is classified as "ice giants"', 4, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Uranus is seventh planet from the Sun. It is the third largest planet on Solar System and it is four times that big that Earth. Its diameter is 31,800 miles (51,100 kilometers). Uranus goes around the Sun in 84 Earth''s years and spins on its axis one time every 17 hours.The atmosphere of Uranus holds hydrogen, helium, and methane which gives Uranus blue-green color.average temperature on Uranus is \n–350° F (–210° C).\n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"In mythology, Uranus was the grandfather of Jupiter and father of Saturn. \n\nMoons"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Uranus has 27 moons"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_3_id, bot_id, false, 'incomplete', 100, '2018-07-03 10:00:00.000000', null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_neptune_id, sample_project_id, 'Neptune - the eighth and farthest known planet from the Sun, the third-most-massive planet in the Solar System', 8, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Neptune was discovered by Johann Galle and Heinrich D''Arrest in 1846. It is the smallest of four gas planets in our Solar System. Neptune''s atmosphere contains hydrogen, helium and methane. Neptune is the most windy planet in Solar System. The winds near the Great Dark Spot were believed to have reached nearly 1,200 miles per hour (approx 1931 km per hour).\nNeptune has six rings, which are believed are fairly new. Those rings are more irregular than other''s planets.   \n\nMythology"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Neptun was known as a god of water. Later on this was extended to include the sea when he became associated with the Greek god Poseidon.\n\nMoons: "},{"attributes":{"header":2},"insert":"\n"},{"insert":"Despina, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Galatea, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Halimede, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Laomedeia, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Larissa, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Naiad, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Nereid, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Neso, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Proteus, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Psamathe, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Sao, "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Thalassa."},{"attributes":{"list":"bullet"},"insert":"\n"}]}', list_3_id, bot_id, false, 'incomplete', null, null, null);
    INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_pluto_id, sample_project_id, 'Pluto - a dwarf planet in the Kuiper belt', 1, '{"ops":[{"insert":"The planet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Pluto is about two-thirds smaller than Earth''s moon. On August 24, 2006, Pluto''s status was officially changed from planet to dwarf planet.  With a diameter of only 1,485 miles (2,390 kilometers) and it is a smallest planet in Solar System. It takes Pluto 248 Earth years to go around the Sun one time. Pluto spins on its axis once every 6 Earth days. Pluto is made by methane and nitrogen ice on top of a rock and water ice mixture.\n\nMythology "},{"attributes":{"header":2},"insert":"\n"},{"insert":"In Greek mythology Pluto is known as Hades. Pluto was the god to whom all men must eventually go. For Romans he was the god of underworld. \n\nMoon"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Pluto has 5 moons "},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"}]}', list_4_id, bot_id, false, 'incomplete', null, null, null);

    -- Tag assignments
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_sun_id, tag_helios_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_sun_id, tag_sol_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_mercury_id, tag_hermes_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_earth_id, tag_gaea_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_mars_id, tag_ares_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_venus_id, tag_aphrodite_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_venus_id, tag_kukulcan_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_jupiter_id, tag_jupiter_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_jupiter_id, tag_zeus_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_saturn_id, tag_cronus_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_neptune_id, tag_neptune_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_neptune_id, tag_poseidon_id);
    INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_pluto_id, tag_hades_id);

    -- Task assignee (bot)
    INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_sun_id, 'assignee');
    INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_uranus_id, 'assignee');
    INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_mercury_id, 'assignee');

    -- Checklist items
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_mars_id, 1, 'Deimons', false);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_mars_id, 2, 'Phobos', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_earth_id, 1, 'Luna', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 5, 'Larissa', false);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 6, 'Naiad', false);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 7, 'Nereid', false);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 11, 'Sao', false);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 12, 'Thalassa', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 10, 'Psamathe', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 9, 'Proteus', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 8, 'Neso', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 1, 'Despina', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 2, 'Galatea', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 4, 'Laomedeia', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_neptune_id, 3, 'Halimede', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_pluto_id, 1, 'Hydra', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_pluto_id, 2, 'Charon', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_pluto_id, 3, 'Nix', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_pluto_id, 4, 'Kerberos', true);
    INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_pluto_id, 5, 'Styx', true);

    -- Files
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_1_id, bot_id, 'sunny the simpsons GIF-source.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/84c7218e1ff67ce6fc8217f205b2c2e77824cf28a294ba1188d43fdb640bafb1', 357, 480, '2018-07-02 09:29:36.993802', 'exists', organization_id);
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_2_id, bot_id, 'freddie mercury dancing GIF-source.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/42c92e97309bad48b39244f585fc749dabda002514328b707e100578c86f02f7', 250, 333, '2018-07-02 09:32:39.950237', 'exists', organization_id);
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_3_id, bot_id, '4e61aeb3b7857b279929bcb15617e168263491ceb746fce9c374db3f8bd48b6f.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/cea11de8c443b9ce3671e679d4b0538e4b5a1aa8c035f1a167cbdb800ba3be9a', 288, 360, '2018-07-02 09:36:06.116040', 'exists', organization_id);
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_4_id, bot_id, 'space nasa GIF-source.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c4f24e14d2eca4694b5e81e05a5e0df28453781565ebf73a63572d83188988c6', 188, 250, '2018-07-02 09:36:08.572294', 'exists', organization_id);
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_5_id, bot_id, 'space orbit GIF-source.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/43d26437a58d79b575ccf72e1fa293173e9c4830d0f6bc196ef9984cae284c3c', 529, 673, '2018-07-02 09:44:23.134059', 'exists', organization_id);
    INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_6_id, bot_id, 'cartoon short disney GIF-source.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/69ef56b52795073e23eaaad5efbdab935b91a187429ad54bda9268509ae0d4e2', 275, 400, '2018-07-02 09:46:24.409276', 'exists', organization_id);
    -- Messages
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_1_id, bot_id, null, organization_id, 'task', task_sun_id, null, '2018-07-02 09:29:37.151000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_2_id, bot_id, null, organization_id, 'task', task_sun_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nIf the sun will burn out we will have sun light for another 8 minutes.\n"}]}', '2018-07-02 09:31:21.383000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_3_id, bot_id, null, organization_id, 'task', task_mercury_id, null, '2018-07-02 09:32:40.096000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_4_id, bot_id, null, organization_id, 'task', task_mercury_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nIf you weigh 70 pounds (32 kg) on Earth, you would weigh only about 27 pounds (12 kg) on Mercury.\n"}]}', '2018-07-02 09:33:01.782000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_5_id, bot_id, null, organization_id, 'task', task_mars_id, null, '2018-07-02 09:36:08.693000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_6_id, bot_id, null, organization_id, 'task', task_venus_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nVenus is caller Earth''s sister planet. Venus is slightly smaller than Earth and it is our closest neighbor.\n"}]}', '2018-07-02 09:38:06.332000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_7_id, bot_id, null, organization_id, 'task', task_jupiter_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nJupiter has a \"pizza moon\"\n"}]}', '2018-07-02 09:39:19.150000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_8_id, bot_id, null, organization_id, 'task', task_uranus_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nIf you make sure that the night sky was extremely dark you can see Uranus with the unaided eye.\n"}]}', '2018-07-02 09:41:12.832000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_9_id, bot_id, null, organization_id, 'task', task_neptune_id, null, '2018-07-02 09:44:23.290000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_10_id, bot_id, null, organization_id, 'task', task_pluto_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nPluto has been visited by one spacecraft.\n"}]}', '2018-07-02 09:46:08.067000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_11_id, bot_id, null, organization_id, 'task', task_pluto_id, null, '2018-07-02 09:46:24.552000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_12_id, bot_id, null, organization_id, 'task', task_neptune_id, '{"ops":[{"insert":"Fun fact: ","attributes":{"bold":true}},{"insert":"\nNeptune spins on its axis very rapidly. It takes 18 hours to make one rotation.\n"}]}', '2018-07-02 09:46:48.129000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_13_id, bot_id, null, organization_id, 'project', sample_project_id, '{"ops":[{"insert":"This is a place where all your team members can communicate to each other\n"}]}', '2018-07-02 13:13:59.753000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_14_id, bot_id, null, organization_id, 'project', sample_project_id, '{"ops":[{"insert":"Just send a message, emoji or any file that help you to express what you want to say\n"}]}', '2018-07-02 13:14:07.824000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_15_id, bot_id, null, organization_id, 'project', sample_project_id, '{"ops":[{"insert":"Whole space is waiting for you!  "},{"insert":{"emoji":{"id":"tada","colons":":tada:"}}},{"insert":" "},{"insert":{"emoji":{"id":"balloon","colons":":balloon:"}}},{"insert":"\n"}]}', '2018-07-02 13:14:40.792000', null);
    INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_16_id, bot_id, null, organization_id, 'project', sample_project_id, '{"ops":[{"insert":"If you have any questions or feedback feel free to contact us. To do it just click on the Intercom button on the right bottom of this page "},{"insert":{"emoji":{"id":"blush","colons":":blush:"}}},{"insert":"\n"}]}', '2018-07-02 13:14:59.328000', null);

    -- Message in container
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_sun_id, message_1_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_sun_id, message_2_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_mercury_id, message_3_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_mercury_id, message_4_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_mars_id, message_5_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_venus_id, message_6_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_jupiter_id, message_7_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_uranus_id, message_8_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_neptune_id, message_9_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_pluto_id, message_10_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_pluto_id, message_11_id);
    INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_neptune_id, message_12_id);
    INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_13_id);
    INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_14_id);
    INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_15_id);
    INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_16_id);

    -- Message attachments
    INSERT INTO messages.message_file (message_id, file_id) VALUES (message_1_id, file_1_id);
    INSERT INTO messages.message_file (message_id, file_id) VALUES (message_3_id, file_2_id);
    INSERT INTO messages.message_file (message_id, file_id) VALUES (message_5_id, file_4_id);
    INSERT INTO messages.message_file (message_id, file_id) VALUES (message_9_id, file_5_id);
    INSERT INTO messages.message_file (message_id, file_id) VALUES (message_11_id, file_6_id);

    -- Task attachments
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_1_id, task_sun_id);
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_2_id, task_mercury_id);
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_3_id, task_mars_id);
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_4_id, task_mars_id);
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_5_id, task_neptune_id);
    INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_6_id, task_pluto_id);
  END;
  $inner$;



  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
