
--
-- ALTER: 1.38.4
-- DATE: 2021-05-18
-- FEATURES:
-- change calendly link
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.38.3';
  newVersion text = '1.38.4';
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
  tag_addons_id     UUID := uuid_generate_v4();
  tag_new_feature_id     UUID := uuid_generate_v4();
  tag_collaboration_id     UUID := uuid_generate_v4();
  tag_important_id     UUID := uuid_generate_v4();
  tag_calendar_id     UUID := uuid_generate_v4();
  tag_easy_id     UUID := uuid_generate_v4();
  tag_improvement_id     UUID := uuid_generate_v4();

  
  list_1_id         UUID := uuid_generate_v4();
  list_2_id         UUID := uuid_generate_v4();
  list_3_id         UUID := uuid_generate_v4();
  list_4_id         UUID := uuid_generate_v4();
  list_5_id         UUID := uuid_generate_v4();


  task_1_list_1_id      UUID := uuid_generate_v4();
  task_2_list_1_id      UUID := uuid_generate_v4();
  task_3_list_1_id      UUID := uuid_generate_v4();
  task_4_list_1_id      UUID := uuid_generate_v4();

  task_1_list_2_id      UUID := uuid_generate_v4();
  task_2_list_2_id      UUID := uuid_generate_v4();
  task_3_list_2_id      UUID := uuid_generate_v4();
  task_4_list_2_id      UUID := uuid_generate_v4();

  task_1_list_3_id      UUID := uuid_generate_v4();
  task_2_list_3_id      UUID := uuid_generate_v4();

  task_1_list_4_id      UUID := uuid_generate_v4();

  task_1_list_5_id      UUID := uuid_generate_v4();
  task_2_list_5_id      UUID := uuid_generate_v4();

  
  file_1_id         UUID := uuid_generate_v4();
  file_2_id         UUID := uuid_generate_v4();
  file_3_id         UUID := uuid_generate_v4();
  file_4_id         UUID := uuid_generate_v4();
  file_5_id         UUID := uuid_generate_v4();
  file_6_id         UUID := uuid_generate_v4();
  file_7_id         UUID := uuid_generate_v4();
  file_8_id         UUID := uuid_generate_v4();
  file_9_id         UUID := uuid_generate_v4();
  file_10_id         UUID := uuid_generate_v4();
  file_11_id         UUID := uuid_generate_v4();
  file_12_id         UUID := uuid_generate_v4();
  file_13_id         UUID := uuid_generate_v4();
  file_14_id         UUID := uuid_generate_v4();

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
  message_17_id     UUID := uuid_generate_v4();
  message_18_id     UUID := uuid_generate_v4();
  message_19_id     UUID := uuid_generate_v4();
  message_20_id     UUID := uuid_generate_v4();
  message_21_id     UUID := uuid_generate_v4();
  message_22_id     UUID := uuid_generate_v4();
  message_23_id     UUID := uuid_generate_v4();
  message_24_id     UUID := uuid_generate_v4();
  message_25_id     UUID := uuid_generate_v4();
  message_26_id     UUID := uuid_generate_v4();
  message_27_id     UUID := uuid_generate_v4();
  message_28_id     UUID := uuid_generate_v4();
  message_29_id     UUID := uuid_generate_v4();
  message_30_id     UUID := uuid_generate_v4();

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
    'Onboarding',
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
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_addons_id, 'Addons', organization_id, '#FBCB53');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_new_feature_id, 'New Feature', organization_id, '#47B9EA');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_collaboration_id, 'Collaboration', organization_id, '#FF8900');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_important_id, 'Important', organization_id, '#7FC241');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_calendar_id, 'Calendar', organization_id, '#FF693B');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_easy_id, 'Easy', organization_id, '#47B9EA');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_improvement_id, 'Improvement', organization_id, '#47B9EA');
  
  -- Task lists in demo project
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_1_id, sample_project_id, 1, 'To begin with...', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_2_id, sample_project_id, 2, 'Features', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_3_id, sample_project_id, 4, 'To Do', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_4_id, sample_project_id, 8, 'In Progress', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_5_id, sample_project_id, 16, 'Done', false, bot_id);

  -- Tasks (To begin with...)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_1_id, sample_project_id, 'Invite other team members using "TEAM +" button on the left panel', 4, 'You can also invite and manage team members in Workspace settings. Just click on your Name in top left corner and choose Settings from the list.', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_1_id, sample_project_id, 'Create your Space (Project) using "SPACES +" button', 6, 'Spaces can be understood as Projects, Clients, Departments.  
Based on our example :rocket:  
- Announcements  
- Sales  
- Marketing  
- Office Space  
- After Work  
- External Clients  


You can archive any Space or Workspace in their Settings. And it can be later brought back if you choose to.', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_3_list_1_id, sample_project_id, 'Create a card, add more details and assign others', 8, 'https://hey.space/application-overview/', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_4_list_1_id, sample_project_id, 'Talk with your colleagues using private or Space chats', 10, 'https://hey.space/application-overview/', list_1_id, bot_id, false, 'incomplete', null, null, null);

-- Tasks (Features)

  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_2_id, sample_project_id, 'Convert emails, import Trello cards, vote, call and track time using our Addons (Settings)', 2, '', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_2_id, sample_project_id, 'You can set your status to let other people know what you are currently doing!', 4, 'Set your vacation period, your current position or let people know that you are Busy at the moment.', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_3_list_2_id, sample_project_id, 'Roles - GUEST', 6, 'Guest role can be used for external clients, preventing them from seeing our whole Workspace. Nice! :)', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_4_list_2_id, sample_project_id, 'Chat with me link', 8, 'Copy this link and share it on Facebook. Every person who clicks it will be transffered into your Workspace as a Guest.  
You will be able to talk with them, but they will not have a possibility to view any of your Space''s.  
That is until you change their role :)', list_2_id, bot_id, false, 'incomplete', null, null, null);

  -- Tasks (ToDo)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_3_id, sample_project_id, 'This card contains a few useful tips inside!', 2, 'Hey!  
Great to see you here :)  

This is an inside of your task. What you can do here is:  
- *assign* members  
- set *progress*  
- add *tags*, checklist  
- *attach* files from your computer / google drive / dropbox / GIF  
- set a start/due *date* (task will be automatically visible in our internal calendar)  
- discuss this particular task using a *dedicated* chat  
- cards can be *archived* and viewed/brought back later using "Archived" filter (top right side of the Board)  
- *move* cards between Lists and Spaces (under Progress section top left of the card)  
- *estimates* can be used as hours required to finish a task, budget or the importance.

(to separate lines in the description, use double "space" symbol at the end (`  `).', list_3_id, bot_id, false, 'incomplete', null, null, null);

  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_3_id, sample_project_id, 'Use our awesome Calendar (internal and external) to stay on top of your work!', 4, 'You can use it in every Space, to see what your team is currently doing or in a private chat to see all your tasks! :calendar:  
Additionaly, you can intergrate HeySpace with external calendars like Google or Apple! Your tasks will be imported and updated every given time.', list_3_id, bot_id, false, 'incomplete', null, null, null);

--  Tasks (In progress)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_4_id, sample_project_id, 'Explore HeySpace!', 2, 'Welcome!  
We hope you will enjoy HeySpace and it will help you and your team!  
In case of any questions, please let us know using the Intercom icon or via emial: support@hey.space.

Have a great day!', list_4_id, bot_id, false, 'incomplete', 25, null, null);

--  Tasks (Done)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_5_id, sample_project_id, 'Register to HeySpace', 2, 'More information about HeySpace can be found on our page:  
https://hey.space', list_5_id, bot_id, false, 'complete', 100, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_5_id, sample_project_id, 'Improve communication and collaboration inside your team', 4, 'Welcome!  

Take your team communication to the next level.  
HeySpace is an innovative task management software with chat feature.  
Send messages to your team to manage tasks, reduce meetings to a minimum, and keep everybody up-to-date.  
On HeySpace you can easily convert part of your conversation into a task.  
Every task can be adjusted – you can set dates, assign people to it, add tags, descriptions, files, and comment on it.  
You can also share files. It allows you to create many spaces, if, for example, you work for various projects or have different clients. And Calendar option is awesome!

Have a great day!', list_5_id, bot_id, false, 'complete', 100, null, null);

  -- Tag assignments
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_2_id, tag_addons_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_2_id, tag_new_feature_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_3_list_2_id, tag_collaboration_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_3_id, tag_important_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_3_id, tag_calendar_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_3_id, tag_addons_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_5_id, tag_easy_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_5_id, tag_improvement_id);

  
  -- Task assignee (bot)
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_1_list_4_id, 'assignee');
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_1_list_5_id, 'assignee');
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_2_list_5_id, 'assignee');
  
  -- Checklist items
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 1, 'Item 1', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 2, 'Item 2', false);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 3, 'Item 3', false);

  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 1, 'Task management (Kanban)', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 2, 'Chat (Private, in projects, in tasks)', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 3, 'Calendar', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 4, 'Hangouts integration', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 5, 'Excel export', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 6, 'Roles', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 7, 'Mobile apps', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 8, 'Recurring tasks', true);

  -- Files
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_1_id, bot_id, 'Settings list.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/fefa4565abfdd377c4460ea7973ae42a19acd3af26621a0e1844a67b2ddd20b3', 393, 317, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_2_id, bot_id, 'Create Space.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/941face2642c9fd638890a691687d55435ac2f5552890479cdaad4baea5d0401', 654, 1126, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_3_id, bot_id, 'AddonsSettings.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/2654445e495094f98b5c844866cfd6ccef2f5846ed07f2b55d014de4c39dff9b', 1079, 1105, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_4_id, bot_id, 'Status.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/4364fb6ae24162d683c8376e96bd6cbd1edea459cdc202a84d046337a9bc6ed0', 395, 309, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_5_id, bot_id, 'Set status.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/d7303ca06f8bb3c7004fc58858124ee33e310b416d219b3d536fef23b02e8df4', 396, 609, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_6_id, bot_id, 'Status -TEAM.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c07c461b02712fe129791fea8bd9e3b1a58e782edae4e53f878ca2953ebb08d0', 90, 255, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_7_id, bot_id, 'Roles.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/727f1bd78fadf6b5e55ecb7d24be6ecbd5371e97d94259cf62023ff1cc1f5c3e', 721, 1016, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_8_id, bot_id, 'Chat with me link.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/05b713489def8c8ff33e446d055577ea88213d67409a4d3890ff04e550814939', 616, 738, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_9_id, bot_id, 'Chat link button.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/5f1b8070ca9ce5f2fd5bcec3ec48060dbdbdfdf6d672c5e68addc60d93959626', 88, 265, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_10_id, bot_id, 'Internal Calendar.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c28d6153e1edf3091f9ad953f265a1043d547f0f5fd2029581baa554dfa83b41', 736, 1578, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_11_id, bot_id, 'Calendar - List.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/945e8f52e0ca27b8428e9be45a4ee9fe2c8afc6613bf8add33e98ad3550b7e2f', 477, 1561, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_12_id, bot_id, 'giphy-cat.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/b0403d358e2b9c87c3b333671eeca0ed1fa28b822d375417ce09961f1940cbb9', 328, 348, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_13_id, bot_id, 'HeyMonster.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/0b15106ca874b99b972ccfd56b2956c75ecccb51ef1cb41518b1e1814b2cdbaa', 222, 232, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_14_id, bot_id, 'HeyMonster!.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/37689c24910e19c6653ae9611c680daccf1113f95016d5d4701eb8fa49f96fd8', 264, 260, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  
  
  -- Messages
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_1_id, bot_id, null, organization_id, 'task', task_1_list_1_id, null, '2018-07-02 09:29:37.151000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_2_id, bot_id, null, organization_id, 'task', task_1_list_1_id, 'People can be invited to a Private Space in individual Space settings.', '2018-07-02 09:31:21.383000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_3_id, bot_id, null, organization_id, 'task', task_2_list_1_id, 'Private Space requires separate invitiation. Public can be found and joined by any Workspace member.', '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_4_id, bot_id, null, organization_id, 'task', task_2_list_1_id, null, '2018-07-02 09:32:45.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_5_id, bot_id, null, organization_id, 'task', task_1_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_6_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_7_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_8_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:50.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_9_id, bot_id, null, organization_id, 'task', task_3_list_2_id, null, '2018-07-02 09:32:40.096000', null);
 
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_10_id, bot_id, null, organization_id, 'task', task_4_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_11_id, bot_id, null, organization_id, 'task', task_4_list_2_id, null, '2018-07-02 09:32:45.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_12_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Hi Team!', '2018-07-02 09:33:01.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_13_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Are you having any "issues" with this task?', '2018-07-02 09:33:11.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_14_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'We can discuss this task here!', '2018-07-02 09:33:21.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_15_id, bot_id, null, organization_id, 'task', task_1_list_3_id, '<!here>', '2018-07-02 10:33:01.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_16_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Recurring cards has been implemented!', '2018-07-02 10:33:11.782000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_17_id, bot_id, null, organization_id, 'task', task_2_list_3_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_18_id, bot_id, null, organization_id, 'task', task_2_list_3_id, 'There is also a List view of tasks!', '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_19_id, bot_id, null, organization_id, 'task', task_2_list_3_id, null, '2018-07-02 09:32:50.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_20_id, bot_id, null, organization_id, 'task', task_1_list_4_id, null, '2018-07-02 09:32:40.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_21_id, bot_id, null, organization_id, 'task', task_1_list_5_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_22_id, bot_id, null, organization_id, 'task', task_2_list_5_id, null, '2018-07-02 09:32:45.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_23_id, bot_id, null, organization_id, 'project', sample_project_id, 'Welcome to HeySpace!', '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_24_id, bot_id, null, organization_id, 'project', sample_project_id, 'This is a place where all your team members can communicate and work together.', '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_25_id, bot_id, null, organization_id, 'project', sample_project_id, 'There are four main views: Chat, Board, Calendar and Timeline.', '2018-07-02 09:32:50.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_26_id, bot_id, null, organization_id, 'project', sample_project_id, 'This is a Space Chat, feel free to explore cards in a Board containing a few useful tips and information.', '2018-07-02 09:32:55.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_27_id, bot_id, null, organization_id, 'project', sample_project_id, 'If you need help with the implementation, book a demo with Marta:', '2018-07-02 09:33:00.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_28_id, bot_id, null, organization_id, 'project', sample_project_id, 'https://support.heyspace.info/sales-en', '2018-07-02 09:33:02.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_30_id, bot_id, null, organization_id, 'project', sample_project_id, 'How to start: https://www.youtube.com/watch?v=MFRbg2BNDdc', '2018-07-02 09:33:04.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_29_id, bot_id, null, organization_id, 'project', sample_project_id, 'Enjoy!', '2018-07-02 09:33:05.096000', null);


  -- Message in container
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_23_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_24_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_25_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_26_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_27_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_28_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_29_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_30_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_1_id, message_1_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_1_id, message_2_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_1_id, message_3_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_1_id, message_4_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_2_id, message_5_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_6_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_7_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_8_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_3_list_2_id, message_9_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_4_list_2_id, message_10_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_4_list_2_id, message_11_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_12_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_13_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_14_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_15_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_16_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_17_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_18_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_19_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_4_id, message_20_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_5_id, message_21_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_5_id, message_22_id);
  
  -- Message attachments
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_1_id, file_1_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_4_id, file_2_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_5_id, file_3_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_6_id, file_4_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_7_id, file_5_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_8_id, file_6_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_9_id, file_7_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_10_id, file_8_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_11_id, file_9_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_17_id, file_10_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_19_id, file_11_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_20_id, file_12_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_21_id, file_13_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_22_id, file_14_id);

 -- Message reactions
  INSERT INTO messages.message_reaction (id, user_id, message_id, emoji_code) VALUES (uuid_generate_v4(), bot_id, message_13_id, ':thinking_face:');
  
  -- Task attachments
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_1_id, task_1_list_1_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_2_id, task_2_list_1_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_3_id, task_1_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_4_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_5_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_6_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_7_id, task_3_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_8_id, task_4_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_9_id, task_4_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_10_id, task_2_list_3_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_11_id, task_2_list_3_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_13_id, task_1_list_5_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_14_id, task_2_list_5_id);
END;
$inner$;

  create OR REPLACE function "project-management".create_sample_space_pl(sample_project_id uuid, organization_id uuid, bot_id uuid, project_start_date timestamp with time zone)
    returns void
  language plpgsql
  as $inner$
  DECLARE
  tag_addons_id     UUID := uuid_generate_v4();
  tag_new_feature_id     UUID := uuid_generate_v4();
  tag_collaboration_id     UUID := uuid_generate_v4();
  tag_important_id     UUID := uuid_generate_v4();
  tag_calendar_id     UUID := uuid_generate_v4();
  tag_easy_id     UUID := uuid_generate_v4();
  tag_improvement_id     UUID := uuid_generate_v4();

  
  list_1_id         UUID := uuid_generate_v4();
  list_2_id         UUID := uuid_generate_v4();
  list_3_id         UUID := uuid_generate_v4();
  list_4_id         UUID := uuid_generate_v4();
  list_5_id         UUID := uuid_generate_v4();


  task_1_list_1_id      UUID := uuid_generate_v4();
  task_2_list_1_id      UUID := uuid_generate_v4();
  task_3_list_1_id      UUID := uuid_generate_v4();
  task_4_list_1_id      UUID := uuid_generate_v4();

  task_1_list_2_id      UUID := uuid_generate_v4();
  task_2_list_2_id      UUID := uuid_generate_v4();
  task_3_list_2_id      UUID := uuid_generate_v4();
  task_4_list_2_id      UUID := uuid_generate_v4();

  task_1_list_3_id      UUID := uuid_generate_v4();
  task_2_list_3_id      UUID := uuid_generate_v4();

  task_1_list_4_id      UUID := uuid_generate_v4();

  task_1_list_5_id      UUID := uuid_generate_v4();
  task_2_list_5_id      UUID := uuid_generate_v4();

  
  file_1_id         UUID := uuid_generate_v4();
  file_2_id         UUID := uuid_generate_v4();
  file_3_id         UUID := uuid_generate_v4();
  file_4_id         UUID := uuid_generate_v4();
  file_5_id         UUID := uuid_generate_v4();
  file_6_id         UUID := uuid_generate_v4();
  file_7_id         UUID := uuid_generate_v4();
  file_8_id         UUID := uuid_generate_v4();
  file_9_id         UUID := uuid_generate_v4();
  file_10_id         UUID := uuid_generate_v4();
  file_11_id         UUID := uuid_generate_v4();
  file_12_id         UUID := uuid_generate_v4();
  file_13_id         UUID := uuid_generate_v4();
  file_14_id         UUID := uuid_generate_v4();

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
  message_17_id     UUID := uuid_generate_v4();
  message_18_id     UUID := uuid_generate_v4();
  message_19_id     UUID := uuid_generate_v4();
  message_20_id     UUID := uuid_generate_v4();
  message_21_id     UUID := uuid_generate_v4();
  message_22_id     UUID := uuid_generate_v4();
  message_23_id     UUID := uuid_generate_v4();
  message_24_id     UUID := uuid_generate_v4();
  message_25_id     UUID := uuid_generate_v4();
  message_26_id     UUID := uuid_generate_v4();
  message_27_id     UUID := uuid_generate_v4();
  message_28_id     UUID := uuid_generate_v4();
  message_29_id     UUID := uuid_generate_v4();
  message_30_id     UUID := uuid_generate_v4();
  message_31_id     UUID := uuid_generate_v4();

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
    'Wprowadzenie',
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
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_addons_id, 'Rozszerzenia', organization_id, '#FBCB53');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_new_feature_id, 'Nowa funkcjonalność', organization_id, '#47B9EA');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_collaboration_id, 'Wspólpraca', organization_id, '#FF8900');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_important_id, 'Ważne', organization_id, '#7FC241');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_calendar_id, 'Kalendarz', organization_id, '#FF693B');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_easy_id, 'Łatwe', organization_id, '#47B9EA');
  INSERT INTO "project-management".tag (id, name, organization_id, color) VALUES (tag_improvement_id, 'Usprawnienie', organization_id, '#47B9EA');
  
  -- Task lists in demo project
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_1_id, sample_project_id, 1, 'Na początek...', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_2_id, sample_project_id, 2, 'Funkcje', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_3_id, sample_project_id, 4, 'Do zrobienia', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_4_id, sample_project_id, 8, 'W trakcie', false, bot_id);
  INSERT INTO "project-management".task_list (id, project_id, "order", name, is_archived, creator_id) VALUES (list_5_id, sample_project_id, 16, 'Zrobione', false, bot_id);

  -- Tasks (To begin with...)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_1_id, sample_project_id, 'Zaproś kolejne osoby do zespołu w sekcji TEAM +', 4, 'Możesz również zapraszać i zarządzać zespołem w opcjach Workspace''a. Kliknij na swoją ikonę w lewym górnym rogu i wybierz Opcje.', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_1_id, sample_project_id, 'Stwórz swój Space przy pomocy "+" obok sekcji SPACE', 6, 'Space''y mogą być traktowane jako Projekty, Klienci, Działy.
Bazując na naszym przykładzie :rocket:  
- Ogłoszenia  
- Finanse  
- Marketing  
- Biuro  
- Klienci zewnętrzni  
- Po pracy  



Każdy Space lub Workspace można zarchiwizować i ewentualnie przywrócić później.', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_3_list_1_id, sample_project_id, 'Stwórz nową kartę, dodaj opis i przypisz odpowiednią osobę', 8, 'https://hey.space/application-overview/', list_1_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_4_list_1_id, sample_project_id, 'Rozmawiaj z współpracownikami poprzez czat prywatny lub w Space''sie', 10, 'https://hey.space/application-overview/', list_1_id, bot_id, false, 'incomplete', null, null, null);

-- Tasks (Features)

  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_2_id, sample_project_id, 'Konwertuj emaile, importuj karty z Trello, głosuj, dzwoń i śledź czas za pomocą naszych Rozszerzeń (Opcje)', 2, '', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_2_id, sample_project_id, 'Ustaw swój Status i poinformuj zespół czym aktualnie się zajmujesz!', 4, 'Możesz ustawić np. okres urlopu, swoje stanowisko lub status "nie przeszkadzać".', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_3_list_2_id, sample_project_id, 'Role - Gość', 6, 'Rola Gościa może zostać użyta w przypadku np. klientów zewnętrznych, aby nie mieli wglądu do naszej całej Organizacji.', list_2_id, bot_id, false, 'incomplete', null, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_4_list_2_id, sample_project_id, 'Ogólny link do czatu', 8, 'Skopiuj link ogólny i udostępnij go np. na Facebooku. Każda osobą, która w niego kliknie zostanie przeniesiona do Twojego Workspace''a jako Gość - będzie mogła z Tobą porozmawiać, ale nie zobaczy żadnych Space''ów.  
Taką osobę można później dodać jako Użytkownika.', list_2_id, bot_id, false, 'incomplete', null, null, null);

  -- Tasks (ToDo)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_3_id, sample_project_id, 'W tej karcie znajdują się przydatne informacje', 2, 'Hej!
Miło Cię widzieć :)

To jest wnętrze Twojego zadania. Co można tutaj zrobić:
- *przypisać* członka zespołu  
- ustawić *postęp*  
- dodać *znaczniki*, checklistę  
- *załączyć* pliki z komputera / google drive / dropbox / GIF  
- ustawić *datę* początkową oraz końcową (zadanie zostanie automatycznie utworzone w Kalendarzu)  
- dyskutować na temat danego zadania w *dedykowanym* czacie  
- karty można *archiwizować* oraz później przeglądać/przywrócić używając filtru „zarchiwizowane”  
- *przenosić* karty pomiędzy Listami oraz Space’ami (pod sekcją Postęp na górze po lewej stronie karty)  
- *Estymaty* mogą być zastosowane jako godziny potrzebne na ukończenie zadania, budżet lub priorytet.

Aby oddzielić linie w Opisie, należy użyć Spacji dwa raz („  „)
', list_3_id, bot_id, false, 'incomplete', null, null, null);

  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_3_id, sample_project_id, 'Skorzystaj z naszego niesamowitego kalendarza!', 4, 'Możesz korzystać z Kalendarza w każdym Space''sie i zobaczyć nad czym aktualnie pracuje zespół lub w prywatnym czacie i zobaczyć swoje zadania! :calendar:  
Dodatkowo, istnieje możliwość integracji z zewnętrznymi kalendarzami takimi jak Google czy Apple! Twoje taski zostaną zaimportowane i aktualizowane co jakiś czas.', list_3_id, bot_id, false, 'incomplete', null, null, null);

--  Tasks (In progress)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_4_id, sample_project_id, 'Odkryj HeySpace!', 2, 'Cześć!  
Mamy nadzieję, że HeySpace będzie do Was świetnym rozwiązaniem!  
W przypadku pytań, prosimy o kontakt poprzez ikonkę Intercom lub email: support@hey.space.  

Miłego dnia!', list_4_id, bot_id, false, 'incomplete', 25, null, null);

--  Tasks (Done)
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_1_list_5_id, sample_project_id, 'Rejestracja w HeySpace', 2, 'Zapraszamy do odwiedzenia naszej strony:
https://hey.space', list_5_id, bot_id, false, 'complete', 100, null, null);
  INSERT INTO "project-management".task (id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id) VALUES (task_2_list_5_id, sample_project_id, 'Usprawnij komunikację oraz współpracę w swoim zespole!', 4, 'Witamy!

Przejdź na kolejny poziom komunikacji.  
HeySpace to innowacyjne narzędzie do zarządzania zadaniami z funkcją czatu.  
Wysyłaj wiadomości do zespołu, ogranicz spotkania i bądź na bieżąco.  
Możesz łatwo przekształcić komentarz w zadanie.  
Każde zadanie zawiera w sobie wiele informacji: daty, przypisane osoby, tagi, opis, pliki i komentarze.  
Możesz dzielić się plikami, tworzyć wiele Space''ów (projektów) do współpracy z klientami. No i Kalendarz jest super :)  
 
Pozdrawiamy,
HeySpace', list_5_id, bot_id, false, 'complete', 100, null, null);

  -- Tag assignments
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_2_id, tag_addons_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_2_id, tag_new_feature_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_3_list_2_id, tag_collaboration_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_3_id, tag_important_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_3_id, tag_calendar_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_3_id, tag_addons_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_1_list_5_id, tag_easy_id);
  INSERT INTO "project-management".task_has_tag (task_id, tag_id) VALUES (task_2_list_5_id, tag_improvement_id);

  
  -- Task assignee (bot)
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_1_list_4_id, 'assignee');
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_1_list_5_id, 'assignee');
  INSERT INTO "project-management".user_in_task (user_id, task_id, role) VALUES (bot_id, task_2_list_5_id, 'assignee');
  
  -- Checklist items
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 1, 'punkt 1', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 2, 'punkt 2', false);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_1_list_3_id, 3, 'punkt 3', false);

  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 1, 'Zarządzanie zadaniami (Kanban)', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 2, 'Czat (prywatny, w projektach oraz w zadaniach)', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 3, 'Kalendarz', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 4, 'Google Hangouts', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 5, 'Excel export', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 6, 'Role', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 7, 'Aplikacje mobilne', true);
  INSERT INTO "project-management".checklist_item (id, task_id, "order", name, is_checked) VALUES (uuid_generate_v4(), task_2_list_5_id, 8, 'Powtarzalne zadania', true);

  -- Files
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_1_id, bot_id, 'lista settings.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/e5937ffae620d042cb1eff70d1c8a2fb37c5586832f9f611816822707487b6d0', 391, 314, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_2_id, bot_id, 'Create Space.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/941face2642c9fd638890a691687d55435ac2f5552890479cdaad4baea5d0401', 654, 1126, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_3_id, bot_id, 'Rozszerzenia - Opcje.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/f95c41079e57dcd59f508e8797559f988f1d012e668a7abe256308e912e9d786', 1020, 1082, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_4_id, bot_id, 'Ustaw status.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/9f4aa954e16550a1426e375c0cfce45e9cb3ffd63917bdda7d52f7a2ee6f4e6c', 396, 310, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_5_id, bot_id, 'Status opcje.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/04eec789722c1cda3deea1284a316e51b1a4aa9205f0ef99f214dfe2b7f1d9c4', 391, 603, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_6_id, bot_id, 'Status widok.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/580c41f5489ed4996accaf885709754ef783b071b94f3ad97b4569e42e9ccba7', 53, 240, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_7_id, bot_id, 'Roles.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/727f1bd78fadf6b5e55ecb7d24be6ecbd5371e97d94259cf62023ff1cc1f5c3e', 721, 1016, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_8_id, bot_id, 'link do czatu.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/3aa334032ce700468325c05c7b377fd6dddcfeb02a234430c9ae3337927b66b7', 607, 712, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_9_id, bot_id, 'czat link przycisk.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c152d02fffc0e26ed406aa15d324aebd3747463cdb0c12c0d0f3aba854ffa26e', 91, 267, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_10_id, bot_id, 'Internal Calendar.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/c28d6153e1edf3091f9ad953f265a1043d547f0f5fd2029581baa554dfa83b41', 736, 1578, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_11_id, bot_id, 'Calendar - List.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/945e8f52e0ca27b8428e9be45a4ee9fe2c8afc6613bf8add33e98ad3550b7e2f', 477, 1561, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_12_id, bot_id, 'giphy-cat.gif', 'image/gif', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/b0403d358e2b9c87c3b333671eeca0ed1fa28b822d375417ce09961f1940cbb9', 328, 348, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_13_id, bot_id, 'HeyMonster.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/0b15106ca874b99b972ccfd56b2956c75ecccb51ef1cb41518b1e1814b2cdbaa', 222, 232, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  INSERT INTO messages.file (id, user_id, name, content_type, url, height, width, created_at, status, organization_id) VALUES (file_14_id, bot_id, 'HeyMonster!.png', 'image/png', 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/37689c24910e19c6653ae9611c680daccf1113f95016d5d4701eb8fa49f96fd8', 264, 260, '2018-07-02 09:29:36.993802', 'exists', organization_id);
  
  
  -- Messages
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_1_id, bot_id, null, organization_id, 'task', task_1_list_1_id, null, '2018-07-02 09:29:37.151000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_2_id, bot_id, null, organization_id, 'task', task_1_list_1_id, 'Aby nadać dostęp do Prywatnego Space''a, należy zaprosić osoby w opcjach Space''a.', '2018-07-02 09:31:21.383000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_3_id, bot_id, null, organization_id, 'task', task_2_list_1_id, 'Do Pywatnych Space''ów jest wymagane osobne zaproszenie w opcjach Space''a. Publiczne Space''y można znaleźć i dołączyć używając wyszukiwarki SPACE''Y w lewym panelu.', '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_4_id, bot_id, null, organization_id, 'task', task_2_list_1_id, null, '2018-07-02 09:32:45.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_5_id, bot_id, null, organization_id, 'task', task_1_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_6_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_7_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_8_id, bot_id, null, organization_id, 'task', task_2_list_2_id, null, '2018-07-02 09:32:50.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_9_id, bot_id, null, organization_id, 'task', task_3_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_29_id, bot_id, null, organization_id, 'task', task_3_list_2_id, 'Gość - dostęp tylko do wybranych Space''ów, ograniczony widok członków zespołu, brak możliwości edycji Space''ów. W planie Darmowym maksymalnie 5 Gości.', '2018-07-02 09:32:45.096000', null);
 
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_10_id, bot_id, null, organization_id, 'task', task_4_list_2_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_11_id, bot_id, null, organization_id, 'task', task_4_list_2_id, null, '2018-07-02 09:32:45.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_12_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Cześć wszystkim! :)', '2018-07-02 09:33:01.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_13_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Czy są jakieś problemy z tym zadaniem?', '2018-07-02 09:33:11.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_14_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'jestem do dyspozycji', '2018-07-02 09:33:21.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_15_id, bot_id, null, organization_id, 'task', task_1_list_3_id, '<!here>', '2018-07-02 10:33:01.782000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_16_id, bot_id, null, organization_id, 'task', task_1_list_3_id, 'Powtarzające karty są już dostępne!', '2018-07-02 10:33:11.782000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_17_id, bot_id, null, organization_id, 'task', task_2_list_3_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_18_id, bot_id, null, organization_id, 'task', task_2_list_3_id, 'I dodatkowy widok zadań w Liście!', '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_19_id, bot_id, null, organization_id, 'task', task_2_list_3_id, null, '2018-07-02 09:32:50.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_20_id, bot_id, null, organization_id, 'task', task_1_list_4_id, null, '2018-07-02 09:32:40.096000', null);

  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_21_id, bot_id, null, organization_id, 'task', task_1_list_5_id, null, '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_22_id, bot_id, null, organization_id, 'task', task_2_list_5_id, null, '2018-07-02 09:32:45.096000', null);
  
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_23_id, bot_id, null, organization_id, 'project', sample_project_id, 'Witamy w HeySpace!', '2018-07-02 09:32:40.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_24_id, bot_id, null, organization_id, 'project', sample_project_id, 'W tym miejscu możesz komunikować się oraz współpracować z całym zespołem.', '2018-07-02 09:32:45.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_25_id, bot_id, null, organization_id, 'project', sample_project_id, 'Są cztery główne widoki: Chat, Tablica, Kalendarz oraz Oś czasu.', '2018-07-02 09:32:50.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_26_id, bot_id, null, organization_id, 'project', sample_project_id, 'Znajdujemy się w czacie Space’a. Zachęcamy do przejścia do Tablicy z kartami, które zawierają kilka przydatnych informacji.', '2018-07-02 09:32:55.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_27_id, bot_id, null, organization_id, 'project', sample_project_id, 'Jeśli potrzebujesz wsparcia we wdrożeniu, zapraszamy na demo z Kamilem:', '2018-07-02 09:33:00.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_28_id, bot_id, null, organization_id, 'project', sample_project_id, 'http://support.heyspace.info/sales-pl', '2018-07-02 09:33:02.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_31_id, bot_id, null, organization_id, 'project', sample_project_id, 'Jak zacząć: https://www.youtube.com/watch?v=MFRbg2BNDdc', '2018-07-02 09:33:04.096000', null);
  INSERT INTO messages.message (id, sender_id, editor_id, organization_id, container_type, container_id, content, created_at, edited_at) VALUES (message_30_id, bot_id, null, organization_id, 'project', sample_project_id, 'Miłego dnia!', '2018-07-02 09:33:05.096000', null);



  -- Message in container
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_23_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_24_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_25_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_26_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_27_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_28_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_30_id);
  INSERT INTO messages.message_container_project (project_id, message_id) VALUES (sample_project_id, message_31_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_1_id, message_1_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_1_id, message_2_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_1_id, message_3_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_1_id, message_4_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_2_id, message_5_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_6_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_7_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_2_id, message_8_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_3_list_2_id, message_9_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_3_list_2_id, message_29_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_4_list_2_id, message_10_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_4_list_2_id, message_11_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_12_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_13_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_14_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_15_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_3_id, message_16_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_17_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_18_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_3_id, message_19_id);

  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_4_id, message_20_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_1_list_5_id, message_21_id);
  INSERT INTO messages.message_container_task (task_id, message_id) VALUES (task_2_list_5_id, message_22_id);
  
  -- Message attachments
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_1_id, file_1_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_4_id, file_2_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_5_id, file_3_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_6_id, file_4_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_7_id, file_5_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_8_id, file_6_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_9_id, file_7_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_10_id, file_8_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_11_id, file_9_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_17_id, file_10_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_19_id, file_11_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_20_id, file_12_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_21_id, file_13_id);
  INSERT INTO messages.message_file (message_id, file_id) VALUES (message_22_id, file_14_id);

 -- Message reactions
  INSERT INTO messages.message_reaction (id, user_id, message_id, emoji_code) VALUES (uuid_generate_v4(), bot_id, message_13_id, ':thinking_face:');
  
  -- Task attachments
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_1_id, task_1_list_1_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_2_id, task_2_list_1_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_3_id, task_1_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_4_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_5_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_6_id, task_2_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_7_id, task_3_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_8_id, task_4_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_9_id, task_4_list_2_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_10_id, task_2_list_3_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_11_id, task_2_list_3_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_13_id, task_1_list_5_id);
  INSERT INTO messages.task_attachment (file_id, task_id) VALUES (file_14_id, task_2_list_5_id);
END;
$inner$;


  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
