  --
  -- ALTER: 1.1.8
  -- DATE: 2018-09-05
  -- FEATURES: 
  -- added inviterId to user table
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.7';
DECLARE newVersion text = '1.1.8';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE "project-management".conversation_settings (
    user_id uuid NOT NULL
      CONSTRAINT conversation_settings_user_id_fk
      REFERENCES core."user"(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,

    conversation_hash uuid NOT NULL,

    organization_id uuid NOT NULL
      CONSTRAINT conversation_settings_organization_id_fk 
      REFERENCES core.organization(id) 
      ON UPDATE CASCADE ON DELETE CASCADE,

    is_visible boolean NOT NULL,

    CONSTRAINT conversation_settings_uniq UNIQUE (user_id, conversation_hash, organization_id)
  );

  ALTER TABLE "project-management".conversation_settings OWNER TO heyspace;

  CREATE TRIGGER watched_conversation_settings_table_trigger
    AFTER INSERT OR UPDATE
    ON "project-management".conversation_settings
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'conversation_hash', 'organization_id');
  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
