
--
-- ALTER: 1.36.1
-- DATE: 2020-08-19
-- FEATURES:
-- Add some indexes to optimize queries
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.36.0';
  newVersion text = '1.36.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

create index notification_recipient_id_type_organization_id on notifications.notification(recipient_id, notification_type, organization_id);

create index notification_recipient_id_organization_id_created_at_id on notifications.notification(recipient_id, organization_id, created_at, id);

create index notification_recipient_id_container_id on notifications.notification(recipient_id, container_id);

create index user_in_task_task_id on "project-management".user_in_task(task_id);

create index user_in_project_project_id on "project-management".user_in_project(project_id);

create index task_has_tag_task_id on "project-management".task_has_tag(task_id);

create index user_follows_task_task_id on notifications.user_follows_task(task_id);

create index user_session_finished_at_user_id on core.user_session(finished_at, user_id);
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
