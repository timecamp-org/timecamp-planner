  --
  -- ALTER: 1.1.11
  -- DATE: 2018-09-05
  -- FEATURES: 
  -- drop not null constraint on tasks and change float to integer
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.10';
DECLARE newVersion text = '1.1.11';

DECLARE orderInterval integer = 65536;

BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  --
  -- WARNING: this alter did not work on production with error
  -- "ERROR: cannot ALTER TABLE "task" because it has pending trigger events"
  -- we split it in parts and then it worked - don't know why - it worked on localhost
  --

  ALTER TABLE "project-management".task
    ALTER COLUMN "order" DROP NOT NULL;

  ALTER TABLE "project-management".task_list
    ALTER COLUMN "order" DROP NOT NULL;


  UPDATE "project-management".task
    SET "order" = null
    WHERE is_archived=true;

  UPDATE "project-management".task_list
    SET "order" = null
    WHERE is_archived=true;


  Update "project-management".task as t 
    SET "order" = orderInterval * (SELECT COUNT(sub.id) 
    FROM "project-management".task as "sub" 
    WHERE t.task_list_id = sub.task_list_id AND sub."order" <= t."order" and sub.is_archived = false)
    where t.is_archived = false;

  Update "project-management".task_list as t 
    SET "order" = orderInterval * (SELECT COUNT(sub.id) 
    FROM "project-management".task_list as "sub" 
    WHERE t.project_id = sub.project_id AND sub."order" <= t."order" and sub.is_archived = false)
    where t.is_archived = false;

  Update "project-management".checklist_item as t 
    SET "order" = orderInterval * (SELECT COUNT(sub.id) 
    FROM "project-management".checklist_item as "sub" 
    WHERE t.task_id = sub.task_id AND sub."order" <= t."order");


  ALTER TABLE "project-management".task
    ALTER COLUMN "order" TYPE integer;

  ALTER TABLE "project-management".task_list
    ALTER COLUMN "order" TYPE integer;

  ALTER TABLE "project-management".checklist_item
    ALTER COLUMN "order" TYPE integer;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
