
--
-- ALTER: 1.6.0
-- DATE: 2019-04-02
-- FEATURES:
-- * create latest task visit table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.5.0';
  newVersion text = '1.6.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE "project-management".task_latest_visit (
    task_id uuid NOT NULL
      CONSTRAINT fk_task_latest_visited_task_id
      REFERENCES "project-management".task(id)
      ON DELETE CASCADE,
    user_id uuid NOT NULL
    CONSTRAINT fk_task_latest_visited_user_id
      REFERENCES core.user(id)
      ON DELETE CASCADE,
    latest_visited_at timestamp with time zone NOT NULL
  );

  ALTER TABLE "project-management".task_latest_visit OWNER TO heyspace;

  ALTER TABLE "project-management".task_latest_visit
    ADD CONSTRAINT task_latest_visit_pk PRIMARY KEY (task_id, user_id);

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
