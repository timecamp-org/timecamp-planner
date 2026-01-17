\connect heyspace

-- TYPE user_rec IS RECORD (id, email)

\set userId1 '''feb4d26a-27f0-4fa0-964d-48af3ca8fa0a'''
\set userId2 '''808c1779-94a3-4cae-84b8-fb9175e91087'''
\set userId3 '''18a5122f-f3ee-461b-a4e3-c22a024a3c6f'''
\set userId4 '''bda32786-808f-4980-af74-8c25dd246c2a'''
\set organizationId1 '''98fb6e05-5a38-45d4-86fa-ed0d3a2b5665'''

\set projectId1 '''c27204ff-2cfd-4742-a130-74997d5e8c2b'''
\set listId1 '''c3227545-25ca-4345-9a93-aecce1befae6'''
\set taskId1 '''27dda582-579b-48e9-a0a1-2dd610a5500a'''

\set convId1 '''4025cace-2734-4f9f-ba3f-87681f494fd8'''
\set convId2 '''1a15dc32-9f6e-4fcd-a145-371009024de6'''
\set convId3 '''25e44ac1-e798-40c7-b460-4ffbf80fc654'''
\set convId4 '''270f75fa-eebc-4909-a59b-527379120341'''
\set convId5 '''5f794ab5-4dac-4cf4-87ec-27196281203d'''
\set convId6 '''78d25481-624c-4201-a7be-317ad34d2c79'''
\set convId7 '''84ed801e-6c25-487e-ad2f-36700574926c'''
\set convId8 '''71ccf73f-5c95-4d5f-a869-2e9ac1491032'''

INSERT INTO core."user" (id, first_name, last_name, email, password_hash, created_at, modified_at, status) VALUES 
  (:userId1, 'HeySpace', 'Developer', 'dev@hey.space', '$2b$10$4w06fPpSunn2JqbKuxgvuuc84ZgaxZttYA44bMax2en1.3I335YxG', '2018-06-12 12:14:52.884356', null, 'exists'),
  (:userId2, 'Sir', 'ToPP', 'test1@timecamp.com', '$2b$10$4w06fPpSunn2JqbKuxgvuuc84ZgaxZttYA44bMax2en1.3I335YxG', '2018-06-12 12:14:52.884356', null, 'exists'),
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'MK', '1', 'test2@timecamp.com', '$2b$10$xrKqZ8KbP.qlxI164q3cVONCIBljMyte8KfRKwGV9AsS7ygDUZjWi', '2018-06-12 12:14:52.884356', null, 'exists'),
  ('922767ce-b4e9-4d34-b295-1c1e270c5cdd', 'MK', '2', 'test3@timecamp.com', '$2b$10$xrKqZ8KbP.qlxI164q3cVONCIBljMyte8KfRKwGV9AsS7ygDUZjWi', '2018-06-12 12:14:52.884356', null, 'exists'),
  (:userId3, 'Grzegorz', 'Pasieka', 'test4@timecamp.com', '$2b$10$DAuShqb4Z8RsG.3U2JoA2e93v8HhvZi8aEOTn/aUjQww7IY4Qkos6', '2018-06-12 12:14:52.884356', null, 'exists'),
  (:userId4, 'Jan', 'Kowalski', 'test5@timecamp.com', '$2b$10$DAuShqb4Z8RsG.3U2JoA2e93v8HhvZi8aEOTn/aUjQww7IY4Qkos6', '2018-06-12 12:14:52.884356', null, 'exists')
;
INSERT INTO core.organization (id, name, created_at, modified_at, status, logo) VALUES
  (:organizationId1, 'organization created via api', '2018-06-12 12:14:59.061858', null, 'exists', null),
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'organization mk', '2018-06-12 12:14:59.061858', null, 'exists', null)
 ;
INSERT INTO core.user_in_organization (user_id, organization_id, role) VALUES 
  (:userId1, :organizationId1, 'owner'),
  (:userId2, :organizationId1, 'member'),
  (:userId3, :organizationId1, 'member'),
  (:userId4, :organizationId1, 'member'),
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'e12748fe-354f-477a-98d5-8b82408ca033', 'owner'),
  ('922767ce-b4e9-4d34-b295-1c1e270c5cdd', 'e12748fe-354f-477a-98d5-8b82408ca033', 'owner')
;
INSERT INTO "project-management".project (id, organization_id, status, name, description, project_type, creator_id, is_private, color, start_date, due_date) VALUES 
  (:projectId1, :organizationId1, 'exists', 'A new project', null, 'project', :userId1, false, null, null, null),
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'e12748fe-354f-477a-98d5-8b82408ca033', 'exists', 'A new project', null, 'project', '922767ce-b4e9-4d34-b295-1c1e270c5cdd', false, null, null, null),
  (:convId1, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId1, false, null, null, null),
  (:convId2, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId2, false, null, null, null),
  (:convId3, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId3, false, null, null, null),
  (:convId4, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId4, false, null, null, null),
  (:convId5, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId1, false, null, null, null),
  (:convId6, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId1, false, null, null, null),
  (:convId7, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId1, false, null, null, null),
  (:convId8, :organizationId1, 'exists', 'A new project', null, 'direct-chat', :userId3, false, null, null, null)
;
INSERT INTO "project-management".user_in_project(user_id, project_id) VALUES 
  (:userId1, :projectId1),
  (:userId1, :convId1),
  (:userId2, :convId2),
  (:userId3, :convId3),
  (:userId4, :convId4),
  (:userId1, :convId5),
  (:userId2, :convId5),
  (:userId1, :convId6),
  (:userId3, :convId6),
  (:userId1, :convId7),
  (:userId4, :convId7),
  (:userId3, :convId8),
  (:userId4, :convId8)
;


INSERT INTO "project-management".task_list(
	id, project_id, "order", name, is_archived, creator_id)	VALUES 
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'e12748fe-354f-477a-98d5-8b82408ca033', 2, 'list-mk1', false, '922767ce-b4e9-4d34-b295-1c1e270c5cdd'),
  (:listId1, :projectId1, 7, 'To Do', false, :userId1)
;
INSERT INTO "project-management".task(
	id, project_id, name, "order", description, task_list_id, creator_id, is_archived, status, progress, due_date, source_message_id)	VALUES 
  ('e12748fe-354f-477a-98d5-8b82408ca033', 'e12748fe-354f-477a-98d5-8b82408ca033', 'task-mk1', 3, 'dsfsf', 'e12748fe-354f-477a-98d5-8b82408ca033', '922767ce-b4e9-4d34-b295-1c1e270c5cdd', false, 'incomplete', null, null, null),
  (:taskId1, :projectId1, 'A New Task [TS]', 4, 'dsfsf', :listId1, :userId1, false, 'incomplete', null, null, null)
;

INSERT INTO "notifications"."user_follows_project" (user_id, project_id) VALUES 
  (:userId1, :projectId1),
  (:userId2, :projectId1)
;
