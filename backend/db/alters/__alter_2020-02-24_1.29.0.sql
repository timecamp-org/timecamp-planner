
--
-- ALTER: 1.29.0
-- DATE: 2020-02-13
-- FEATURES:
-- Add jobs progress
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.28.1';
  newVersion text = '1.29.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE SCHEMA IF NOT EXISTS jobs;
  ALTER SCHEMA jobs OWNER TO heyspace;

   -- Job status
  CREATE TABLE jobs.job_status (
      id UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT job_status_id_pk PRIMARY KEY,
      namespace text NOT NULL,
      jobs_spawned int NOT NULL DEFAULT 0,
      jobs_done int NOT NULL DEFAULT 0,
      iteration_count int NOT NULL DEFAULT 0,
      created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp with time zone,
      user_id UUID,
      organization_id UUID,
      is_failed boolean NOT NULL DEFAULT false,

      CONSTRAINT job_status_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT job_status_organization_id_fk FOREIGN KEY (organization_id) REFERENCES "core".organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT job_status_uniq UNIQUE (namespace, user_id, organization_id)
  );
  ALTER TABLE jobs.job_status OWNER TO heyspace;


  --- Job status trigger
DROP TRIGGER IF EXISTS watched_jobs_job_status_table_trigger
ON "jobs".job_status;
CREATE TRIGGER watched_jobs_job_status_table_trigger
  AFTER INSERT OR UPDATE
  ON "jobs".job_status
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger();




  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
