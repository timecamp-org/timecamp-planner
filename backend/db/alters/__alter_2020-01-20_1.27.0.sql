
--
-- ALTER: 1.27.0
-- DATE: 2020-01-20
-- FEATURES:
-- Refactor triggers for adding users to various entities to emmit added user id along entity id
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.26.1';
  newVersion text = '1.27.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  -- checklist item assignee
  DROP TRIGGER IF EXISTS watched_user_in_checklist_item_table_trigger
    ON "project-management".user_in_checklist_item;
  CREATE TRIGGER watched_user_in_checklist_item_table_trigger
    AFTER INSERT OR DELETE
    ON "project-management".user_in_checklist_item
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('checklist_item_id', 'user_id');

  -- task assignee
  DROP TRIGGER IF EXISTS watched_user_in_task_table_trigger
  ON "project-management".user_in_task;
  CREATE TRIGGER watched_user_in_task_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "project-management".user_in_task
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id', 'user_id');

  -- task follower
  DROP TRIGGER IF EXISTS watched_user_follows_task_table_trigger
  ON "notifications".user_follows_task;
  CREATE TRIGGER watched_user_follows_task_table_trigger
    AFTER INSERT OR DELETE
    ON "notifications".user_follows_task
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_id', 'user_id');

  -- Project follower
  DROP TRIGGER IF EXISTS watched_user_follows_project_table_trigger
  ON "notifications".user_follows_project;
  CREATE TRIGGER watched_user_follows_project_table_trigger
    AFTER INSERT OR DELETE
    ON "notifications".user_follows_project
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('project_id', 'user_id');

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
