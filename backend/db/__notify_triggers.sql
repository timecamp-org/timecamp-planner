\connect heyspace
\set ON_ERROR_STOP on

-- --
-- -- Name: core; Type: SCHEMA; Schema: -; Owner: heyspace
-- --

CREATE SCHEMA IF NOT EXISTS watchers;

ALTER SCHEMA watchers
OWNER TO heyspace;

-- TRIGGER ---
CREATE OR REPLACE FUNCTION watchers.notify_trigger()
  RETURNS TRIGGER AS $$
DECLARE
  id_column     VARCHAR;
  notification  JSON;
  id            VARCHAR;
  record_to_use RECORD;
BEGIN

  IF TG_OP = 'DELETE'
  THEN
    record_to_use = OLD;
  ELSE
    record_to_use = NEW;
  END IF;

  -- First argument is id column name
  IF TG_NARGS < 1 THEN
    EXECUTE 'SELECT $1.id'
    INTO id
    USING record_to_use;
  ELSIF TG_NARGS = 1 THEN
    -- Selects value from column given by one param`
    EXECUTE 'SELECT $1.' || TG_ARGV[0]
    INTO id
    USING record_to_use;
  ELSIF TG_NARGS = 2 THEN
    -- Selects value from column given by one param`
    EXECUTE 'SELECT ($1.' || TG_ARGV[0] || ', $1.' || TG_ARGV[1] || ')'
    INTO id
    USING record_to_use;
  END IF;

  notification = json_build_object(
      'table', TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
      'action', TG_OP,
      'id', id);
  PERFORM pg_notify('notify', notification :: TEXT);
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER ---
-- TODO: Make sth more universal when it's needed --
CREATE OR REPLACE FUNCTION watchers.notify_task_list_followers_trigger()
  RETURNS TRIGGER AS $$
DECLARE
  task_list_id_column VARCHAR;
  user_id_column      VARCHAR;
  notification        JSON;
  task_list_id        UUID;
  user_id             UUID;
  record_to_use       RECORD;
BEGIN
  task_list_id_column = 'task_list_id';
  user_id_column = 'user_id';

  IF TG_OP = 'DELETE'
  THEN
    record_to_use = OLD;
  ELSE
    record_to_use = NEW;
  END IF;

  -- Selects value from column given by `task_list_id_column`
  EXECUTE 'SELECT $1.' || task_list_id_column
  INTO task_list_id
  USING record_to_use;

  -- Selects value from column given by `task_list_id_column`
  EXECUTE 'SELECT $1.' || user_id_column
  INTO user_id
  USING record_to_use;

  notification = json_build_object(
      'table', TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
      'action', TG_OP,
      'optionalId', user_id,
      'id', task_list_id);
  PERFORM pg_notify('notify', notification :: TEXT);
  RETURN new;
END;
$$ LANGUAGE plpgsql;


--- CONNECT TRIGGERS ---

--- INSERT ---

--- User trigger ---
DROP TRIGGER IF EXISTS watched_user_table_trigger
ON core."user";
CREATE TRIGGER watched_user_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core."user"
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- Task list
DROP TRIGGER IF EXISTS watched_task_list_table_trigger
ON "project-management".task_list;
CREATE TRIGGER watched_task_list_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".task_list
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- Task list follower
DROP TRIGGER IF EXISTS watched_user_follows_task_list_table_trigger
ON "notifications".user_follows_task_list;
CREATE TRIGGER watched_user_follows_task_list_table_trigger
  AFTER INSERT OR DELETE
  ON "notifications".user_follows_task_list
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_task_list_followers_trigger();

--- Task
DROP TRIGGER IF EXISTS watched_task_table_trigger
ON "project-management".task;
CREATE TRIGGER watched_task_table_trigger
  AFTER INSERT OR DELETE
  ON "project-management".task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

DROP TRIGGER IF EXISTS watched_activity_container_task_table_trigger
ON notifications.activity_container_task;
CREATE TRIGGER watched_activity_container_task_table_trigger 
  AFTER INSERT
  ON notifications.activity_container_task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('activity_id', 'task_id');

DROP TRIGGER IF EXISTS watched_activity_container_project_table_trigger
ON notifications.activity_container_project;
CREATE TRIGGER watched_activity_container_project_table_trigger 
  AFTER INSERT
  ON notifications.activity_container_project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('activity_id', 'project_id');

--- User_in_task
DROP TRIGGER IF EXISTS watched_user_in_task_table_trigger
ON "project-management".user_in_task;
CREATE TRIGGER watched_user_in_task_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".user_in_task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id');

--- Task follower
DROP TRIGGER IF EXISTS watched_user_follows_task_table_trigger
ON "notifications".user_follows_task;
CREATE TRIGGER watched_user_follows_task_table_trigger
  AFTER INSERT OR DELETE
  ON "notifications".user_follows_task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id');

--- Project
DROP TRIGGER IF EXISTS watched_project_table_trigger
ON "project-management".project;
CREATE TRIGGER watched_project_table_trigger
  AFTER INSERT OR DELETE
  ON "project-management".project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- user_in_project
DROP TRIGGER IF EXISTS watched_user_in_project_table_trigger
ON "project-management".user_in_project;
CREATE TRIGGER watched_user_in_project_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "project-management".user_in_project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id');

--- Project follower
DROP TRIGGER IF EXISTS watched_user_follows_project_table_trigger
ON "notifications".user_follows_project;
CREATE TRIGGER watched_user_follows_project_table_trigger
  AFTER INSERT OR DELETE
  ON "notifications".user_follows_project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id');

--- Tag ---
DROP TRIGGER IF EXISTS watched_tag_table_trigger
ON "project-management".tag;
CREATE TRIGGER watched_tag_table_trigger
  AFTER INSERT
  ON "project-management".tag
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- Create and update message ---
DROP TRIGGER IF EXISTS watched_message_table_trigger
ON "messages".message;
CREATE TRIGGER watched_message_table_trigger
  AFTER INSERT OR UPDATE
  ON "messages".message
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- In-App Notification ---
DROP TRIGGER IF EXISTS watched_notification_in_app_table_trigger
ON "notifications".notification_in_app;
CREATE TRIGGER watched_notification_in_app_table_trigger
  AFTER INSERT OR UPDATE
  ON "notifications".notification_in_app
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('notification_id');

DROP TRIGGER IF EXISTS watched_activity_table_trigger
ON notifications.activity;
CREATE TRIGGER watched_activity_table_trigger 
  AFTER INSERT
  ON notifications.activity
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- Messages
DROP TRIGGER IF EXISTS watched_message_container_task_table_trigger
ON "messages".message_container_task;
CREATE TRIGGER watched_message_container_task_table_trigger 
  AFTER DELETE or INSERT
  ON "messages".message_container_task
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id', 'task_id');

DROP TRIGGER IF EXISTS watched_messages_message_container_project_table_trigger
ON "messages".message_container_project;
CREATE TRIGGER watched_messages_message_container_project_table_trigger 
  AFTER DELETE or INSERT
  ON "messages".message_container_project
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id', 'project_id');
DROP TRIGGER IF EXISTS watched_messages_message_mentions_user_table_trigger
ON "messages"."message_mentions_user";
CREATE TRIGGER watched_messages_message_mentions_user_table_trigger 
  AFTER INSERT
  ON "messages"."message_mentions_user"
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id');
DROP TRIGGER IF EXISTS watched_messages_message_hail_table_trigger
ON "messages"."message_hail";
CREATE TRIGGER watched_messages_message_hail_table_trigger 
  AFTER INSERT
  ON "messages"."message_hail"
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id');

DROP TRIGGER IF EXISTS watched_messages_message_reaction_table_trigger
ON "messages".message_reaction;
CREATE TRIGGER watched_messages_message_reaction_table_trigger 
  AFTER INSERT
  ON "messages".message_reaction
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

DROP TRIGGER IF EXISTS watched_messages_delete_message_reaction_table_trigger
ON "messages".message_reaction;
CREATE TRIGGER watched_messages_delete_message_reaction_table_trigger 
  AFTER DELETE
  ON "messages".message_reaction
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'message_id');

DROP TRIGGER IF EXISTS watched_messages_message_project_key_press_table_trigger
ON "messages".project_key_press;
CREATE TRIGGER watched_messages_message_project_key_press_table_trigger 
  AFTER UPDATE
  ON "messages".project_key_press
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id','user_id');

DROP TRIGGER IF EXISTS watched_messages_message_task_key_press_table_trigger
ON "messages".task_key_press;
CREATE TRIGGER watched_messages_message_task_key_press_table_trigger 
  AFTER UPDATE
  ON "messages".task_key_press
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id','user_id');

DROP TRIGGER IF EXISTS watched_messages_project_message_read_table_trigger
ON "messages".project_message_read;
CREATE TRIGGER watched_messages_project_message_read_table_trigger 
  AFTER UPDATE
  ON "messages".project_message_read
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id','user_id');

DROP TRIGGER IF EXISTS watched_messages_task_message_read_table_trigger
ON "messages".task_message_read;
CREATE TRIGGER watched_messages_task_message_read_table_trigger 
  AFTER UPDATE
  ON "messages".task_message_read
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id','user_id');

--- Tag to task
DROP TRIGGER IF EXISTS watched_task_has_tag_table_trigger
ON "project-management".task_has_tag;
CREATE TRIGGER watched_task_has_tag_table_trigger
  AFTER INSERT OR DELETE
  ON "project-management".task_has_tag
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id');

--- File
DROP TRIGGER IF EXISTS watched_file_table_trigger
ON "messages".file;
CREATE TRIGGER watched_file_table_trigger
  AFTER INSERT OR UPDATE
  ON "messages".file
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- file to task
DROP TRIGGER IF EXISTS watched_task_attachment_table_trigger
ON "messages".task_attachment;
CREATE TRIGGER watched_task_attachment_table_trigger
  AFTER INSERT OR DELETE
  ON "messages".task_attachment
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id');

--- file to message
DROP TRIGGER IF EXISTS watched_message_file_table_trigger
ON "messages".message_file;
CREATE TRIGGER watched_message_file_table_trigger
  AFTER INSERT
  ON "messages".message_file
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('message_id');

--- Create checklistItem
DROP TRIGGER IF EXISTS watched_checklist_item_table_insert_trigger
ON "project-management".checklist_item;
CREATE TRIGGER watched_checklist_item_table_insert_trigger
  AFTER INSERT
  ON "project-management".checklist_item
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- Update checklistItem
DROP TRIGGER IF EXISTS watched_checklist_item_table_update_trigger
ON "project-management".checklist_item;
CREATE TRIGGER watched_checklist_item_table_update_trigger
  AFTER UPDATE
  ON "project-management".checklist_item
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

--- User in organization
DROP TRIGGER IF EXISTS watched_user_in_organization_table_trigger
ON core.user_in_organization;
CREATE TRIGGER watched_user_in_organization_table_trigger
  AFTER INSERT OR DELETE
  ON core.user_in_organization
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'organization_id');

--- Assignee user to task ---
-- DROP TRIGGER IF EXISTS watched_user_in_task_table_trigger ON "project-management".user_in_task;
-- CREATE TRIGGER watched_user_in_task_table_trigger AFTER INSERT ON "project-management".user_in_task
--   FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();

