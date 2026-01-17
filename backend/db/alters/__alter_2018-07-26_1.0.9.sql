  --
  -- ALTER: 1.0.9
  -- DATE: 25.07.2018
  -- FEATURES: 
  -- * add chat notification settings table
  --
  

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.8';
DECLARE newVersion text = '1.0.9';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);


  --
  -- START ALTER (insert statements below)
  --

CREATE TYPE notifications.chat_notification_settings_type AS ENUM (
    'all',
    'onlyMentions',
    'nothing'
);

CREATE TABLE notifications.chat_notification_settings
(
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    chat_notification_settings_type notifications.chat_notification_settings_type NOT NULL,
    CONSTRAINT chat_notification_settings_pkey PRIMARY KEY (user_id, project_id)
);

ALTER TABLE notifications.chat_notification_settings
    OWNER to heyspace;

ALTER TABLE ONLY notifications.chat_notification_settings
    ADD CONSTRAINT chat_notification_settings_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY notifications.chat_notification_settings
    ADD CONSTRAINT chat_notification_settings_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--- chat notification settings
DROP TRIGGER IF EXISTS watched_chat_notification_settings_table_trigger
ON notifications.chat_notification_settings;
CREATE TRIGGER watched_chat_notification_settings_table_trigger
  AFTER INSERT OR UPDATE
  ON notifications.chat_notification_settings
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_id', 'project_id');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
