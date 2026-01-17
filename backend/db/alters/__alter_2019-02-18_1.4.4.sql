
--
-- ALTER: 1.4.4
-- DATE: 2019-02-18
-- FEATURES:
-- * create table is mail already sent to user
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.4.3';
  newVersion text = '1.4.4';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TYPE core.mail_type AS ENUM (
    'notReturningUsers'
  );

  CREATE TABLE core.user_mail_sent (
    user_id uuid NOT NULL
      CONSTRAINT fk_user_mail_sent_user_id
      REFERENCES core."user"(id)
      ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mail_type core.mail_type NOT NULL
  );

  ALTER TABLE core.user_mail_sent OWNER TO heyspace;

  ALTER TABLE core.user_mail_sent
      ADD CONSTRAINT user_id_for_mail_type UNIQUE (user_id, mail_type) DEFERRABLE INITIALLY IMMEDIATE;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
