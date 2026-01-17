--
-- ALTER: 1.1.3
-- DATE: 2018-08-08
-- FEATURES: 
-- * mark (objectId, order) unique keys as DEFERRABLE
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.1.2';
  newVersion text = '1.1.3';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE "project-management".task_list DROP CONSTRAINT task_list_order_for_project;
  ALTER TABLE "project-management".task DROP CONSTRAINT task_order_for_task_list;
  ALTER TABLE "project-management".checklist_item DROP CONSTRAINT checklist_item_order_for_task;

  ALTER TABLE "project-management".task_list
    ADD CONSTRAINT task_list_order_for_project UNIQUE (project_id, "order") DEFERRABLE INITIALLY IMMEDIATE;

  ALTER TABLE "project-management".task
      ADD CONSTRAINT task_order_for_task_list UNIQUE (task_list_id, "order") DEFERRABLE INITIALLY IMMEDIATE;

  ALTER TABLE "project-management".checklist_item
    ADD CONSTRAINT checklist_item_order_for_task UNIQUE (task_id, "order") DEFERRABLE INITIALLY IMMEDIATE;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;