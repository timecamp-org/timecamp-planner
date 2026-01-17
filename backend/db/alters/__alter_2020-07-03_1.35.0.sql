
--
-- ALTER: 1.35.0
-- DATE: 2020-07-03
-- FEATURES:
-- Add user notification displayed at table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.34.0';
  newVersion text = '1.35.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  PERFORM dictionaries.create_dict('notification_center_type', 'text');
  insert into dictionaries.notification_center_type (value, label) VALUES
    ('CHAT', 'Chat'),
    ('ACTION_BASED', 'Action based');

  CREATE TABLE "notifications".user_latest_notifications_display (
    user_in_organization_id UUID NOT NULL,
    notification_center_type_id UUID NOT NULL,
    displayed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT user_in_organization_id_notification_center_type_id_pkey PRIMARY KEY (user_in_organization_id, notification_center_type_id),
    CONSTRAINT user_latest_notifications_display_notification_center_type_fk  FOREIGN KEY (notification_center_type_id) REFERENCES dictionaries.notification_center_type(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_in_organization_user_latest_notifications_display_fk FOREIGN KEY (user_in_organization_id) REFERENCES core.user_in_organization(id) ON UPDATE CASCADE ON DELETE CASCADE
  );

  ALTER TABLE "notifications".user_latest_notifications_display
        OWNER to heyspace;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
