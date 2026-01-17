--
-- ALTER: 1.1.10
-- DATE: 2018-09-20
-- FEATURES: 
--   converted all foreign key on delete to 'cascade' so that we can easily delete user (workspace) data from DB
--


\set ON_ERROR_STOP on

DO $$
DECLARE   previousVersion text = '1.1.9';

  DECLARE newVersion      text = '1.1.10';

BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion)
  ;

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "project-management".project
    DROP CONSTRAINT project_user_follows_project_user_id_fk,
    ADD CONSTRAINT project_creator_user_id
  FOREIGN KEY (creator_id) REFERENCES core."user" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE "messages".message
    DROP CONSTRAINT fk_messages_message_organization_id,
    ADD CONSTRAINT fk_messages_message_organization_id
  FOREIGN KEY (organization_id) REFERENCES core."organization" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    DROP CONSTRAINT message_sender_id_fk,
    ADD CONSTRAINT message_sender_id_fk
  FOREIGN KEY (sender_id) REFERENCES core."user" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    DROP CONSTRAINT message_editor_id_fk,
    ADD CONSTRAINT message_editor_id_fk
  FOREIGN KEY (editor_id) REFERENCES core."user" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE "messages".message_mentions_user
    DROP CONSTRAINT fk_message_mentions_user_message_id,
    ADD CONSTRAINT fk_message_mentions_user_message_id
  FOREIGN KEY (message_id) REFERENCES messages."message" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    DROP CONSTRAINT fk_message_mentions_user_user_id,
    ADD CONSTRAINT fk_message_mentions_user_user_id
  FOREIGN KEY (user_id) REFERENCES core."user" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE "messages".message_hail
    DROP CONSTRAINT fk_message_hail_message_id,
    ADD CONSTRAINT fk_message_hail_message_id
  FOREIGN KEY (message_id) REFERENCES "messages"."message" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;


  ALTER TABLE extensions.extension_in_organization
    DROP CONSTRAINT extension_in_organization_organization_id_fk,
    ADD CONSTRAINT extension_in_organization_organization_id_fk
  FOREIGN KEY (organization_id) REFERENCES "core"."organization" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.notification
    DROP CONSTRAINT notification_activity_id_fk,
    ADD CONSTRAINT notification_activity_id_fk
  FOREIGN KEY (activity_id) REFERENCES "notifications".activity (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.activity_container_project
    DROP CONSTRAINT activity_container_project_project_id_fk,
    ADD CONSTRAINT activity_container_project_project_id_fk
  FOREIGN KEY (project_id) REFERENCES "project-management".project (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.activity_target_project
    DROP CONSTRAINT activity_target_project_project_id_fk,
    ADD CONSTRAINT activity_target_project_project_id_fk
  FOREIGN KEY (project_id) REFERENCES "project-management".project (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE core.user_invitation
    DROP CONSTRAINT user_invitation_organization_id_fk,
    ADD CONSTRAINT user_invitation_organization_id_fk
  FOREIGN KEY (organization_id) REFERENCES "core".organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    DROP CONSTRAINT user_invitation_invited_user_id_fk,
    ADD CONSTRAINT user_invitation_invited_user_id_fk
  FOREIGN KEY (invited_user_id) REFERENCES "core"."user" (id) ON UPDATE CASCADE ON DELETE CASCADE,
    DROP CONSTRAINT user_invitation_inviter_id_fk,
    ADD CONSTRAINT user_invitation_inviter_id_fk
  FOREIGN KEY (inviter_id) REFERENCES "core"."user" (id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.activity_container_task_list
    DROP CONSTRAINT activity_container_task_list_task_list_id_fk,
    ADD CONSTRAINT activity_container_task_list_task_list_id_fk
  FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE CASCADE;

  ALTER TABLE notifications.activity_target_task_list
    DROP CONSTRAINT activity_target_task_list_task_list_id_fk,
    ADD CONSTRAINT activity_target_task_list_task_list_id_fk
  FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.activity_container_task
    DROP CONSTRAINT activity_container_task_task_id_fk,
    ADD CONSTRAINT activity_container_task_task_id_fk
  FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE notifications.activity_target_task
    DROP CONSTRAINT activity_target_task_task_id_fk,
    ADD CONSTRAINT activity_target_task_task_id_fk
  FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE
  ;

  ALTER TABLE "extension-data"."task-voting_reaction"
    DROP CONSTRAINT "extension-data_task-voting_reaction_task_id_fk",
    ADD CONSTRAINT "extension-data_task-voting_reaction_task_id_fk"
  FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE
  ;


  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code)
  VALUES
    (newVersion)
  ;

END $$
;
