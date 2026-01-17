
--
-- ALTER: 1.19.0
-- DATE: 2019-07-08
-- FEATURES:
-- Add user feedback table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.18.1';
  newVersion text = '1.19.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TYPE analytics.feedback_type AS ENUM (
    'subscription_cancelation',
    'account_deleted'
);

  CREATE TABLE analytics.user_feedback (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    feedback_type analytics.feedback_type NOT NULL,
    feedback jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT user_feedback_pk PRIMARY KEY (id),
    CONSTRAINT user_feedback_user_fk FOREIGN KEY (user_id) REFERENCES core.user(id)
);


  ALTER TABLE analytics.user_feedback OWNER TO heyspace;

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
