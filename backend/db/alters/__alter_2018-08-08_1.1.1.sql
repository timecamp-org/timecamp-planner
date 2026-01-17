
--
-- ALTER: 1.1.1
-- DATE: 2018-08-08
-- FEATURES: 
-- * updated indexes on message table.
--


\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.1.0';
  newVersion text = '1.1.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  
  ALTER TABLE "messages"."message" ADD COLUMN "container_id" UUID DEFAULT NULL;
  
  UPDATE "messages"."message" SET container_id = "messages"."message_container_project".project_id
  FROM "messages"."message_container_project"
  WHERE "messages"."message".id = "messages"."message_container_project".message_id
    AND "messages"."message".container_type = 'project';

  UPDATE "messages"."message" SET container_id = "messages"."message_container_task".task_id
  FROM "messages"."message_container_task"
  WHERE "messages"."message".id = "messages"."message_container_task".message_id
    AND "messages"."message".container_type = 'task';

  ALTER TABLE "messages"."message" ALTER COLUMN "container_id" SET NOT NULL;
  CREATE INDEX "message_container_id_create_at" ON "messages"."message"
  (container_id, created_at);
  
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
