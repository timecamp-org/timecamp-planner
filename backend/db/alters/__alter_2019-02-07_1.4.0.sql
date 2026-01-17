
--
-- ALTER: 1.4.0
-- DATE: 2019-02-07
-- FEATURES:
-- * OAuth2 tables
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.3.0';
  newVersion text = '1.4.0';
  calendar_extension_id uuid = uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


  --
  -- ACCESS_TOKEN
  --
CREATE TABLE auth.oauth_access_token (
  access_token text NOT NULL,
  client_id text NOT NULL,
  user_id uuid NOT NULL,
  scope text NOT NULL,
  expires_at timestamp without time zone NOT NULL
);

ALTER TABLE auth.oauth_access_token OWNER TO heyspace;
ALTER TABLE ONLY auth.oauth_access_token
    ADD CONSTRAINT oauth_access_token_pkey PRIMARY KEY (access_token);

  --
  -- REFRESH_TOKEN
  --
CREATE TABLE auth.oauth_refresh_token (
  refresh_token text NOT NULL,
  client_id text NOT NULL,
  user_id uuid NOT NULL,
  scope text NOT NULL,
  expires_at timestamp without time zone NOT NULL
);

ALTER TABLE auth.oauth_refresh_token OWNER TO heyspace;
ALTER TABLE ONLY auth.oauth_refresh_token
    ADD CONSTRAINT oauth_refresh_token_pkey PRIMARY KEY (refresh_token);


  --
  -- AUTHORIZATION_CODE
  --
CREATE TABLE auth.oauth_authorization_code (
  authorization_code text NOT NULL,
  client_id text NOT NULL,
  user_id uuid NOT NULL,
  redirect_uri text NOT NULL,
  scope text NOT NULL,
  expires_at timestamp without time zone NOT NULL
);

ALTER TABLE auth.oauth_authorization_code OWNER TO heyspace;
ALTER TABLE ONLY auth.oauth_authorization_code
    ADD CONSTRAINT oauth_authorization_code_pkey PRIMARY KEY (authorization_code);


  --
  -- OAUTH_CLIENT
  --
CREATE TABLE auth.oauth_client (
  id text NOT NULL,
  name text NOT NULL,
  thumbnail_url character varying(8000),
  client_secret text NOT NULL,
  redirect_uris text NOT NULL,
  grants text NOT NULL,
  access_token_lifetime integer NOT NULL,
  refresh_token_lifetime integer NOT NULL
);

ALTER TABLE auth.oauth_client OWNER TO heyspace;
ALTER TABLE ONLY auth.oauth_client
    ADD CONSTRAINT oauth_client_pkey PRIMARY KEY (id, client_secret);
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
