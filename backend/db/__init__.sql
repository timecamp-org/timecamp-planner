--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4


\set ON_ERROR_STOP on
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: DATABASE heyspace; Type: COMMENT; Schema: -; Owner: heyspace
--

COMMENT ON DATABASE heyspace IS 'default administrative connection database';

--
-- Name: analytics; Type: SCHEMA; Schema: -; Owner: heyspace
--

CREATE SCHEMA analytics;


ALTER SCHEMA analytics OWNER TO heyspace;


--
-- Name: core; Type: SCHEMA; Schema: -; Owner: heyspace
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO heyspace;

--
-- Name: notifications; Type: SCHEMA; Schema: -; Owner: heyspace
--

CREATE SCHEMA notifications;


ALTER SCHEMA notifications OWNER TO heyspace;

--
-- Name: project-management; Type: SCHEMA; Schema: -; Owner: heyspace
--

CREATE SCHEMA "project-management";


ALTER SCHEMA "project-management" OWNER TO heyspace;

CREATE SCHEMA "auth";

ALTER SCHEMA "auth" OWNER TO heyspace;

CREATE SCHEMA messages;
ALTER SCHEMA messages OWNER TO heyspace;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: entity_status; Type: TYPE; Schema: core; Owner: heyspace
--

CREATE TYPE core.entity_status AS ENUM (
    'exists',
    'deleted',
    'archived'
);


ALTER TYPE core.entity_status OWNER TO heyspace;

--
-- Name: registration_status; Type: TYPE; Schema: core; Owner: heyspace
--

CREATE TYPE core.registration_status AS ENUM (
    'pending',
    'registered',
    'verified'
);


ALTER TYPE core.registration_status OWNER TO heyspace;

--
-- Name: organization_role; Type: TYPE; Schema: core; Owner: heyspace
--

CREATE TYPE core.organization_role AS ENUM (
    'owner',
    'member'
);


ALTER TYPE core.organization_role OWNER TO heyspace;

--
-- Name: activity_type; Type: TYPE; Schema: notifications; Owner: heyspace
--

CREATE TYPE notifications.activity_type AS ENUM (
    'create',
    'add',
    'delete',
    'remove',
    'modify'
);


ALTER TYPE notifications.activity_type OWNER TO heyspace;

--
-- Name: project_role; Type: TYPE; Schema: project-management; Owner: heyspace
--

CREATE TYPE "project-management".project_role AS ENUM (
    'owner',
    'manager',
    'member'
);


ALTER TYPE "project-management".project_role OWNER TO heyspace;

--
-- Name: project_type; Type: TYPE; Schema: project-management; Owner: heyspace
--

CREATE TYPE "project-management".project_type AS ENUM (
    'project',
    'direct-chat',
    'group-chat'
);


ALTER TYPE "project-management".project_type OWNER TO heyspace;

--
-- Name: target_type; Type: TYPE; Schema: notifications; Owner: heyspace
--

CREATE TYPE notifications.target_type AS ENUM (
    'project',
    'task',
    'user',
    'task_list',
    'file'
);


ALTER TYPE notifications.target_type OWNER TO heyspace;

--
-- Name: container_type; Type: TYPE; Schema: notifications; Owner: heyspace
--

CREATE TYPE notifications.container_type AS ENUM (
    'project',
    'task',
    'user',
    'task_list'
);


ALTER TYPE notifications.container_type OWNER TO heyspace;

--
-- Name: task_role; Type: TYPE; Schema: project-management; Owner: heyspace
--

CREATE TYPE "project-management".task_role AS ENUM (
    'owner',
    'collaborator',
    'assignee'
);


ALTER TYPE "project-management".task_role OWNER TO heyspace;


CREATE TYPE "messages".container_type AS ENUM (
    'task',
    'project'
);

ALTER TYPE "messages".container_type OWNER TO heyspace;

CREATE TYPE "project-management".task_status AS ENUM (
 'complete',
 'incomplete'
);
ALTER TYPE "project-management".task_status OWNER TO heyspace;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: organization; Type: TABLE; Schema: core; Owner: heyspace
--

CREATE TABLE core.organization (
    id uuid NOT NULL,
    name character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_at timestamp with time zone,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,
    logo text,

    CONSTRAINT organization_id_pk PRIMARY KEY (id)
);


ALTER TABLE core.organization OWNER TO heyspace;

--
-- Name: user; Type: TABLE; Schema: core; Owner: heyspace
--

CREATE TABLE core."user" (
    id uuid NOT NULL,
    first_name character varying(200),
    last_name character varying(200),
    nickname character varying(200),
    email public.citext NOT NULL,
    password_hash character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_at timestamp with time zone,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,
    registration_status core.registration_status DEFAULT 'pending'::core.registration_status NOT NULL,
    locale character varying(5) DEFAULT 'en' NOT NULL,
    avatar_url text,
    is_bot BOOLEAN NOT NULL DEFAULT FALSE,
    notifications_displayed_at timestamp with TIME ZONE,
    ip_address INET DEFAULT NULL,
    referrer text,

    CONSTRAINT user_email_pk UNIQUE (email),
    CONSTRAINT user_pkey PRIMARY KEY (id)
);


ALTER TABLE core."user" OWNER TO heyspace;


CREATE TABLE core."user_session" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    CONSTRAINT user_session_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_session_user_id FOREIGN KEY (user_id) REFERENCES core.user(id) ON UPDATE CASCADE ON DELETE CASCADE
);
ALTER TABLE core."user_session" OWNER TO heyspace;

CREATE VIEW core."user_online" AS
    SELECT user_id, true AS is_online FROM core."user_session"
    WHERE finished_at IS NULL
    GROUP BY user_id;
ALTER VIEW core.user_online OWNER TO heyspace;


--
-- Name: COLUMN "user".password_hash; Type: COMMENT; Schema: core; Owner: heyspace
--

COMMENT ON COLUMN core."user".password_hash IS 'Use modular crypt format';


--
-- Name: user_in_organization; Type: TABLE; Schema: core; Owner: heyspace
--

CREATE TABLE core.user_in_organization (
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    role core.organization_role DEFAULT 'member'::core.organization_role NOT NULL
);


ALTER TABLE core.user_in_organization OWNER TO heyspace;

--
-- Name: activity; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity (
    id uuid NOT NULL,
    actor_id uuid,
    type notifications.activity_type NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    target_type notifications.target_type NOT NULL,
    target_value TEXT,
    container_type notifications.container_type,
    container_value TEXT
);


ALTER TABLE notifications.activity OWNER TO heyspace;

--
-- Name: activity_changed_prop; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_changed_prop (
    id uuid NOT NULL,
    activity_id uuid NOT NULL,
    property_name character varying(100),
    old jsonb,
    new jsonb
);


ALTER TABLE notifications.activity_changed_prop OWNER TO heyspace;

--
-- Name: COLUMN activity_changed_prop.old; Type: COMMENT; Schema: notifications; Owner: heyspace
--

COMMENT ON COLUMN notifications.activity_changed_prop.old IS 'Format decided and understandable by app code.';


--
-- Name: activity_container_project; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_container_project (
    activity_id uuid NOT NULL,
    project_id uuid NOT NULL
);


ALTER TABLE notifications.activity_container_project OWNER TO heyspace;

--
-- Name: activity_container_task; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_container_task (
    activity_id uuid NOT NULL,
    task_id uuid NOT NULL
);


ALTER TABLE notifications.activity_container_task OWNER TO heyspace;

--
-- Name: activity_container_list; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_container_task_list (
    activity_id uuid NOT NULL,
    task_list_id uuid NOT NULL
);


ALTER TABLE notifications.activity_container_task_list OWNER TO heyspace;

--
-- Name: activity_target_project; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_target_project (
    activity_id uuid NOT NULL,
    project_id uuid NOT NULL
);


ALTER TABLE notifications.activity_target_project OWNER TO heyspace;

--
-- Name: activity_target_task; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_target_task (
    activity_id uuid NOT NULL,
    task_id uuid NOT NULL
);


ALTER TABLE notifications.activity_target_task OWNER TO heyspace;

--
-- Name: activity_target_task_list; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_target_task_list (
    activity_id uuid NOT NULL,
    task_list_id uuid NOT NULL
);


ALTER TABLE notifications.activity_target_task_list OWNER TO heyspace;

--
-- Name: activity_target_task_list; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_target_task_file (
    activity_id uuid NOT NULL,
    file_id uuid NOT NULL
);


ALTER TABLE notifications.activity_target_task_file OWNER TO heyspace;

--
-- Name: activity_target_user; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.activity_target_user (
    activity_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE notifications.activity_target_user OWNER TO heyspace;

--
-- Name: notification; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification (
    id uuid NOT NULL,
    actor_id uuid NOT NULL,
    organization_id uuid,
    recipient_id uuid NOT NULL,
    activity_id uuid,
    notification_type integer NOT NULL,
    container_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,

    data jsonb,

    CONSTRAINT notification_pkey PRIMARY KEY (id),
    CONSTRAINT fk_notifications_notification_organization_id FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE
);


ALTER TABLE notifications.notification OWNER TO heyspace;

--
-- Name: COLUMN notification.recipient_id; Type: COMMENT; Schema: notifications; Owner: heyspace
--

COMMENT ON COLUMN notifications.notification.recipient_id IS 'User that should receive this notif';


--
-- Name: notification_in_app; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification_in_app (
    notification_id uuid NOT NULL,
    read_at timestamp with time zone,
    is_archived boolean NOT NULL DEFAULT false
);


ALTER TABLE notifications.notification_in_app OWNER TO heyspace;

--
-- Name: notification_push; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification_push (
    notification_id uuid NOT NULL,
    sent_at timestamp with time zone,
    retry_count int not null default 0,

    CONSTRAINT notification_push_pkey PRIMARY KEY (notification_id),
    CONSTRAINT notification_push_notification_id_fk FOREIGN KEY (notification_id) REFERENCES notifications.notification(id) ON UPDATE CASCADE ON DELETE CASCADE
);


ALTER TABLE notifications.notification_push OWNER TO heyspace;

--
-- Name: TABLE notification_push; Type: COMMENT; Schema: notifications; Owner: heyspace
--

COMMENT ON TABLE notifications.notification_push IS 'free to add more fields';

--
-- Name: TABLE notification_push_device; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification_push_device
(
    device_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL
);

ALTER TABLE notifications.notification_push_device OWNER to heyspace;

CREATE UNIQUE INDEX notification_push_device_for_user
    ON notifications.notification_push_device USING btree
    (device_id, user_id);


--
-- Name: TABLE notification_delivery_settings; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification_delivery_settings
(
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    email_notifications boolean NOT NULL,
    mobile_notifications boolean NOT NULL,
    push_notifications boolean NOT NULL,
    CONSTRAINT notification_delivery_settings_pkey PRIMARY KEY (user_id, organization_id)
);

ALTER TABLE notifications.notification_delivery_settings
    OWNER to heyspace;

--
-- Name: notification_type; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.notification_type (
    id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE notifications.notification_type OWNER TO heyspace;

--
-- Name: COLUMN notification_type.name; Type: COMMENT; Schema: notifications; Owner: heyspace
--

COMMENT ON COLUMN notifications.notification_type.name IS 'This will probably be for internal use only and never displayed by app. Application should never insert into this table. Only migration scripts.';


--
-- Name: user_follows_project; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.user_follows_project (
    user_id uuid NOT NULL,
    project_id uuid NOT NULL
);


ALTER TABLE notifications.user_follows_project OWNER TO heyspace;

--
-- Name: user_follows_task_list; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.user_follows_task_list (
    user_id uuid NOT NULL,
    task_list_id uuid NOT NULL
);


ALTER TABLE notifications.user_follows_task_list OWNER TO heyspace;


--
-- Name: user_follows_task; Type: TABLE; Schema: notifications; Owner: heyspace
--

CREATE TABLE notifications.user_follows_task (
    user_id uuid NOT NULL,
    task_id uuid NOT NULL
);


ALTER TABLE notifications.user_follows_task OWNER TO heyspace;

--
-- Name: project; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".project (
    id uuid NOT NULL,
    organization_id uuid,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,
    name character varying(8000),
    description text,
    project_type "project-management".project_type DEFAULT 'project'::"project-management".project_type,
    creator_id uuid NOT NULL,
    is_private boolean NOT NULL DEFAULT false,
    is_archived boolean NOT NULL DEFAULT false,
    color character varying(20),
    start_date timestamp with time zone,
    due_date timestamp with time zone,
    -- Every user joining organization is automatically added to this project.
    auto_join boolean NOT NULL DEFAULT false, 
        
    CONSTRAINT project_pkey PRIMARY KEY (id),
    CONSTRAINT project_organization_id_fk FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_user_follows_project_user_id_fk FOREIGN KEY (creator_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE SET NULL
);


ALTER TABLE "project-management".project OWNER TO heyspace;

--
-- Name: project_has_tag; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".project_has_tag (
    project_id uuid NOT NULL,
    tag_id uuid NOT NULL
);


ALTER TABLE "project-management".project_has_tag OWNER TO heyspace;

--
-- Name: tag; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".tag (
    id uuid NOT NULL,
    name character varying(500),
    organization_id uuid NOT NULL,
    color character varying(20)
);


ALTER TABLE "project-management".tag OWNER TO heyspace;

--
-- Name: task; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".task (
    id uuid NOT NULL,
    project_id uuid,
    name character varying(8000),
    "order" double precision NOT NULL CHECK ("order" > 0),
    description text,
    task_list_id uuid,
    creator_id uuid,
    is_archived boolean NOT NULL DEFAULT false,
    status "project-management".task_status DEFAULT 'incomplete'::"project-management".task_status NOT NULL,
    progress integer,
    due_date timestamp with time zone,
    source_message_id uuid,

    CONSTRAINT task_pkey PRIMARY KEY (id)
);

ALTER TABLE "project-management".task OWNER TO heyspace;

--
-- Name: task_has_tag; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".task_has_tag (
    task_id uuid NOT NULL,
    tag_id uuid NOT NULL
);


ALTER TABLE "project-management".task_has_tag OWNER TO heyspace;

--
-- Name: task_list; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".task_list (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    "order" double precision NOT NULL CHECK ("order" > 0),
    name character varying(8000),
    is_archived boolean NOT NULL DEFAULT false,
    creator_id uuid
);


ALTER TABLE "project-management".task_list OWNER TO heyspace;

--
-- Name: user_in_project; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".user_in_project (
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    role "project-management".project_role DEFAULT 'member'::"project-management".project_role NOT NULL
);


ALTER TABLE "project-management".user_in_project OWNER TO heyspace;

--
-- Name: user_in_task; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".user_in_task (
    user_id uuid NOT NULL,
    task_id uuid NOT NULL,
    role "project-management".task_role DEFAULT 'collaborator'::"project-management".task_role
);


ALTER TABLE "project-management".user_in_task OWNER TO heyspace;

--
-- Name: checklist_item; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".checklist_item (
    id uuid NOT NULL,
    task_id uuid NOT NULL,
    "order" double precision NOT NULL CHECK ("order" > 0),
    name character varying(8000),
    is_checked boolean NOT NULL DEFAULT false,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL
);


ALTER TABLE "project-management".checklist_item OWNER TO heyspace;

--
-- Name: file; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "messages".file (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    name character varying(8000),
    content_type character varying(200),
    url character varying(8000),
    height int,
    width int,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,
    organization_id uuid NOT NULL
);


ALTER TABLE "messages".file OWNER TO heyspace;

--
-- Name: task_attachment; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "messages".task_attachment (
    file_id uuid NOT NULL,
    task_id uuid NOT NULL
);


ALTER TABLE "messages".task_attachment OWNER TO heyspace;

--
-- Name: user_project_order; Type: TABLE; Schema: project-management; Owner: heyspace
--

CREATE TABLE "project-management".user_project_order (
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    "order" double precision DEFAULT 0.0 NOT NULL
);


ALTER TABLE "project-management".user_project_order OWNER TO heyspace;


CREATE TABLE "messages".message (
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    editor_id uuid,
    organization_id uuid NOT NULL,
    container_type "messages".container_type NOT NULL, 
    content text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    edited_at timestamp with time zone,

    CONSTRAINT message_pkey PRIMARY KEY (id),
    CONSTRAINT fk_messages_message_organization_id
        FOREIGN KEY (organization_id) REFERENCES "core".organization(id)
);

ALTER TABLE "messages".message
    OWNER to heyspace;

CREATE TYPE messages.hail_type AS ENUM (
    'here',
    'space',
    'assignees'
);

CREATE TABLE "messages"."message_mentions_user" (
    message_id uuid NOT NULL,
    user_id uuid NOT NULL,

    CONSTRAINT message_mentions_user_pkey PRIMARY KEY (message_id, user_id),
    CONSTRAINT fk_message_mentions_user_message_id
        FOREIGN KEY (message_id) REFERENCES "messages".message(id),
    CONSTRAINT fk_message_mentions_user_user_id
        FOREIGN KEY (user_id) REFERENCES "core".user(id)
);
ALTER TABLE "messages"."message_mentions_user" OWNER TO heyspace;

CREATE TABLE "messages"."message_hail" (
    message_id uuid NOT NULL,
    hail_type messages.hail_type NOT NULL,

    CONSTRAINT message_hail_pkey PRIMARY KEY (message_id, hail_type),
    CONSTRAINT fk_message_hail_message_id
      FOREIGN KEY (message_id) REFERENCES "messages".message(id)
);

ALTER TABLE "messages"."message_hail" OWNER TO heyspace;

CREATE TABLE "messages".message_container_project
(
    project_id uuid NOT NULL,
    message_id uuid NOT NULL,
    
    CONSTRAINT message_container_project_pkey
        PRIMARY KEY (project_id, message_id)
);

ALTER TABLE "messages".message_container_project
    OWNER to heyspace;


CREATE TABLE "messages".message_container_task
(
    task_id uuid NOT NULL,
    message_id uuid NOT NULL
);

ALTER TABLE "messages".message_container_task
    OWNER to heyspace;

CREATE TABLE "messages".message_file
(
    message_id uuid NOT NULL,
    file_id uuid NOT NULL
);

ALTER TABLE "messages".message_file
    OWNER to heyspace;

CREATE TABLE "messages".message_reaction (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    message_id uuid NOT NULL,
    colon character varying(50) NOT NULL
);

ALTER TABLE "messages".message_reaction
    OWNER to heyspace;


CREATE TABLE "messages".task_key_press
(
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" timestamp with time zone,

    CONSTRAINT task_key_press_task_id_user_id PRIMARY KEY (task_id, user_id),
    CONSTRAINT task_key_press_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT task_key_press_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "messages".task_key_press
    OWNER to heyspace;


CREATE TABLE "messages".project_key_press
(
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" timestamp with time zone,

    CONSTRAINT project_key_press_project_id_user_id PRIMARY KEY (project_id, user_id),
    CONSTRAINT project_key_press_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_key_press_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "messages".project_key_press
    OWNER to heyspace;


CREATE TABLE "messages".task_message_read
(
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,

    CONSTRAINT task_message_read_task_id_user_id PRIMARY KEY (task_id, user_id),
    CONSTRAINT task_message_read_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT task_message_read_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "messages".task_message_read
    OWNER to heyspace;


CREATE TABLE "messages".project_message_read
(
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,

    CONSTRAINT project_message_read_project_id_user_id PRIMARY KEY (project_id, user_id),
    CONSTRAINT project_message_read_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_message_read_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "messages".project_message_read
    OWNER to heyspace;


ALTER TABLE ONLY "messages".message_reaction
    ADD CONSTRAINT message_reaction_pkey PRIMARY KEY (id);


CREATE TABLE auth.oauth_user_binding
(
    user_id uuid NOT NULL,
    provider_code character(150) NOT NULL,
    subject_id character(150) NOT NULL,

    CONSTRAINT oauth_user_binding_pkey PRIMARY KEY (user_id, provider_code, subject_id)
);

ALTER TABLE auth.oauth_user_binding
    OWNER to heyspace;


--
-- Name: user user_email_pk; Type: CONSTRAINT; Schema: core; Owner: heyspace
--


--
-- Name: user_in_organization user_in_organization_user_id_organization_id_pk; Type: CONSTRAINT; Schema: core; Owner: heyspace
--

ALTER TABLE ONLY core.user_in_organization
    ADD CONSTRAINT user_in_organization_user_id_organization_id_pk PRIMARY KEY (user_id, organization_id);




--
-- Name: activity_changed_prop activity_changed_prop_pkey; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_changed_prop
    ADD CONSTRAINT activity_changed_prop_pkey PRIMARY KEY (id);


--
-- Name: activity_container_project activity_container_project_activity_id_project_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_project
    ADD CONSTRAINT activity_container_project_activity_id_project_id_pk PRIMARY KEY (activity_id, project_id);


--
-- Name: activity_container_task activity_container_task_activity_id_task_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task
    ADD CONSTRAINT activity_container_task_activity_id_task_id_pk PRIMARY KEY (activity_id, task_id);


--
-- Name: activity_container_list activity_container_task_list_activity_id_task_list_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task_list
    ADD CONSTRAINT activity_container_task_list_activity_id_task_list_id_pk PRIMARY KEY (activity_id, task_list_id);


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- Name: activity_target_project activity_target_project_activity_id_project_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_project
    ADD CONSTRAINT activity_target_project_activity_id_project_id_pk PRIMARY KEY (activity_id, project_id);


--
-- Name: activity_target_task activity_target_task_activity_id_task_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task
    ADD CONSTRAINT activity_target_task_activity_id_task_id_pk PRIMARY KEY (activity_id, task_id);



--
-- Name: activity_target_task_list activity_target_task_list_activity_id_task_list_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_list
    ADD CONSTRAINT activity_target_task_list_activity_id_task_list_id_pk PRIMARY KEY (activity_id, task_list_id);

--
-- Name: activity_target_task_file activity_target_task_file_activity_id_file_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_file
    ADD CONSTRAINT activity_target_task_file_activity_id_file_id_pk PRIMARY KEY (activity_id, file_id);


--
-- Name: activity_target_user activity_target_user_activity_id_user_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_user
    ADD CONSTRAINT activity_target_user_activity_id_user_id_pk PRIMARY KEY (activity_id, user_id);


--
-- Name: notification_in_app notification_in_app_pkey; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.notification_in_app
    ADD CONSTRAINT notification_in_app_pkey PRIMARY KEY (notification_id);





--
-- Name: notification_type notification_type_dict_pkey; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.notification_type
    ADD CONSTRAINT notification_type_dict_pkey PRIMARY KEY (id);


--
-- Name: user_follows_project user_follows_project_user_id_project_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_project
    ADD CONSTRAINT user_follows_project_user_id_project_id_pk PRIMARY KEY (user_id, project_id);


--
-- Name: user_follows_task_list user_follows_task_list_user_id_task_list_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task_list
    ADD CONSTRAINT user_follows_task_list_user_id_task_list_id_pk PRIMARY KEY (user_id, task_list_id);

--
-- Name: user_follows_task user_follows_task_user_id_task_id_pk; Type: CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task
    ADD CONSTRAINT user_follows_task_user_id_task_id_pk PRIMARY KEY (user_id, task_id);


--
-- Name: project_has_tag project_has_tag_project_id_tag_id_pk; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".project_has_tag
    ADD CONSTRAINT project_has_tag_project_id_tag_id_pk PRIMARY KEY (project_id, tag_id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: task_has_tag task_has_tag_task_id_tag_id_pk; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task_has_tag
    ADD CONSTRAINT task_has_tag_task_id_tag_id_pk PRIMARY KEY (task_id, tag_id);


--
-- Name: task_list task_list_pkey; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task_list
    ADD CONSTRAINT task_list_pkey PRIMARY KEY (id);


--
-- Name: checklist_item checklist_item_pkey; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".checklist_item
    ADD CONSTRAINT checklist_item_pkey PRIMARY KEY (id);


--
-- Name: file file_pkey; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "messages".file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- Name: user_in_project user_in_project_user_id_project_id_pk; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_project
    ADD CONSTRAINT user_in_project_user_id_project_id_pk PRIMARY KEY (user_id, project_id);


--
-- Name: user_in_task user_in_task_user_id_task_id_pk; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_task
    ADD CONSTRAINT user_in_task_user_id_task_id_pk PRIMARY KEY (user_id, task_id);


--
-- Name: user_project_order user_project_order_user_id_project_id_pk; Type: CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_project_order
    ADD CONSTRAINT user_project_order_user_id_project_id_pk PRIMARY KEY (user_id, project_id);


--
-- Name: user_in_organization fk_organization_id; Type: FK CONSTRAINT; Schema: core; Owner: heyspace
--

ALTER TABLE ONLY core.user_in_organization
    ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_in_organization fk_user_id; Type: FK CONSTRAINT; Schema: core; Owner: heyspace
--

ALTER TABLE ONLY core.user_in_organization
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_changed_prop activity_changed_prop_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_changed_prop
    ADD CONSTRAINT activity_changed_prop_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_container_project activity_container_project_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_project
    ADD CONSTRAINT activity_container_project_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_container_project activity_container_project_project_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_project
    ADD CONSTRAINT activity_container_project_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_container_task activity_container_task_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task
    ADD CONSTRAINT activity_container_task_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_container_task activity_container_task_task_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task
    ADD CONSTRAINT activity_container_task_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_container_task_list activity_container_task_list_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task_list
    ADD CONSTRAINT activity_container_task_list_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_container_task_list activity_container_task_list_task_list_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_container_task_list
    ADD CONSTRAINT activity_container_task_list_task_list_id_fk FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_target_project activity_target_project_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_project
    ADD CONSTRAINT activity_target_project_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_target_project activity_target_project_project_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_project
    ADD CONSTRAINT activity_target_project_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_target_task activity_target_task_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task
    ADD CONSTRAINT activity_target_task_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_target_task activity_target_task_task_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task
    ADD CONSTRAINT activity_target_task_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_target_task_list activity_target_task_list_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_list
    ADD CONSTRAINT activity_target_task_list_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_target_task_list activity_target_task_list_task_list_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_list
    ADD CONSTRAINT activity_target_task_list_task_list_id_fk FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE SET NULL;

--
-- Name: activity_target_task_file activity_target_file_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_file
    ADD CONSTRAINT activity_target_file_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_target_task_file activity_target_task_file_file_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_task_file
    ADD CONSTRAINT activity_target_task_file_file_id_fk FOREIGN KEY (file_id) REFERENCES "messages".file(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_target_user activity_target_user_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_user
    ADD CONSTRAINT activity_target_user_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: activity_target_user activity_target_user_user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity_target_user
    ADD CONSTRAINT activity_target_user_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity activity_user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.activity
    ADD CONSTRAINT activity_user_id_fk FOREIGN KEY (actor_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notification_in_app notification_in_app_notification_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.notification_in_app
    ADD CONSTRAINT notification_in_app_notification_id_fk FOREIGN KEY (notification_id) REFERENCES notifications.notification(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_notification_type_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

-- ALTER TABLE ONLY notifications.notification
--     ADD CONSTRAINT notification_notification_type_id_fk FOREIGN KEY (notification_type) REFERENCES notifications.notification_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notification notification_activity_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.notification
    ADD CONSTRAINT notification_activity_id_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON UPDATE CASCADE ON DELETE SET NULL;



--
-- Name: notification notification_user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.notification
    ADD CONSTRAINT notification_user_id_fk FOREIGN KEY (recipient_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows_project user_follows_project_project_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_project
    ADD CONSTRAINT user_follows_project_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows_project user_follows_project_user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_project
    ADD CONSTRAINT user_follows_project_user_id_fk FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows_task_list user_follows_task_list_core.user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task_list
    ADD CONSTRAINT "user_follows_task_list_core.user_id_fk" FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: user_follows_task user_follows_task_core.user_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task
    ADD CONSTRAINT "user_follows_task_core.user_id_fk" FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows_task_list user_follows_task_list_task_list_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task_list
    ADD CONSTRAINT user_follows_task_list_task_list_id_fk FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: user_follows_task user_follows_task_task_id_fk; Type: FK CONSTRAINT; Schema: notifications; Owner: heyspace
--

ALTER TABLE ONLY notifications.user_follows_task
    ADD CONSTRAINT user_follows_task_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_has_tag project_has_tag_project_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".project_has_tag
    ADD CONSTRAINT project_has_tag_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_has_tag project_has_tag_tag_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".project_has_tag
    ADD CONSTRAINT project_has_tag_tag_id_fk FOREIGN KEY (tag_id) REFERENCES "project-management".tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag tag_organization_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".tag
    ADD CONSTRAINT tag_organization_id_fk FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_has_tag task_has_tag_tag_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task_has_tag
    ADD CONSTRAINT task_has_tag_tag_id_fk FOREIGN KEY (tag_id) REFERENCES "project-management".tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_has_tag task_has_tag_task_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task_has_tag
    ADD CONSTRAINT task_has_tag_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_list task_list_project_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task_list
    ADD CONSTRAINT task_list_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task task_project_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task
    ADD CONSTRAINT task_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task task_task_list_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task
    ADD CONSTRAINT task_task_list_id_fk FOREIGN KEY (task_list_id) REFERENCES "project-management".task_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task task_user_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".task
    ADD CONSTRAINT task_user_id_fk FOREIGN KEY (creator_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_in_project user_in_project_project_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_project
    ADD CONSTRAINT user_in_project_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_in_project user_in_project_user_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_project
    ADD CONSTRAINT user_in_project_user_id_fk FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_in_task user_in_task_task_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_task
    ADD CONSTRAINT user_in_task_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_attachment task_attachment_task_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "messages".task_attachment
    ADD CONSTRAINT task_attachment_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_attachment task_attachment_file_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "messages".task_attachment
    ADD CONSTRAINT task_attachment_file_id_fk FOREIGN KEY (file_id) REFERENCES "messages".file(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: checklist_item user_in_task_task_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".checklist_item
    ADD CONSTRAINT checklist_item_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: file file_user_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "messages".file
    ADD CONSTRAINT file_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_in_task user_in_task_user_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_in_task
    ADD CONSTRAINT user_in_task_user_id_fk FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_project_order user_project_order_project_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_project_order
    ADD CONSTRAINT user_project_order_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_project_order user_project_order_user_id_fk; Type: FK CONSTRAINT; Schema: project-management; Owner: heyspace
--

ALTER TABLE ONLY "project-management".user_project_order
    ADD CONSTRAINT user_project_order_user_id_fk FOREIGN KEY (user_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "messages".message
    ADD CONSTRAINT message_sender_id_fk FOREIGN KEY (sender_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "messages".message
    ADD CONSTRAINT message_editor_id_fk FOREIGN KEY (editor_id) REFERENCES core."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "messages".message_container_task
    ADD CONSTRAINT message_task_id_fk FOREIGN KEY (task_id) REFERENCES "project-management".task(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "messages".message_container_task
  ADD CONSTRAINT message_container_task_message_id_fk FOREIGN KEY(message_id) REFERENCES "messages".message (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY "messages".message_container_project
    ADD CONSTRAINT message_project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "messages".message_container_project
  ADD CONSTRAINT message_container_project_message_id_fk
FOREIGN KEY (message_id) REFERENCES "messages".message (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY "messages".message_file
    ADD CONSTRAINT message_file_message_id_fk FOREIGN KEY (message_id) REFERENCES "messages".message(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "messages".message_file
    ADD CONSTRAINT message_file_file_id_fk FOREIGN KEY (file_id) REFERENCES "messages".file(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "messages".message_reaction
    ADD CONSTRAINT message_reaction_user_id_fk FOREIGN KEY (user_id) REFERENCES "core".user(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "messages".message_reaction
    ADD CONSTRAINT message_reaction_message_id_fk FOREIGN KEY (message_id) REFERENCES "messages".message(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "messages".message_reaction
    ADD CONSTRAINT message_reaction_for_user UNIQUE (user_id, message_id, colon);

ALTER TABLE "project-management".task_list
    ADD CONSTRAINT task_list_order_for_project UNIQUE (project_id, "order");

ALTER TABLE "project-management".task
    ADD CONSTRAINT task_order_for_task_list UNIQUE (task_list_id, "order");

ALTER TABLE "project-management".checklist_item
    ADD CONSTRAINT checklist_item_order_for_task UNIQUE (task_id, "order");

--
-- Name: usage_tracker_events; Type: TABLE; Schema: analytics; Owner: heyspace
--

CREATE TABLE analytics."usage_tracker_events"
(
    id uuid NOT NULL,
    user_id uuid,
    name character varying(200) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    custom_props jsonb,
    CONSTRAINT usage_tracker_events_event_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_event_actor_user_id FOREIGN KEY (user_id)
        REFERENCES core.user (id)
        ON DELETE CASCADE
);

ALTER TABLE analytics."usage_tracker_events" OWNER TO heyspace;

--
-- Name: mixpanel_events_shipment; Type: TABLE; Schema: analytics; Owner: heyspace
--

CREATE TABLE analytics."mixpanel_events_shipment"
(
    id uuid NOT NULL,
    shipment_successful boolean NOT NULL,
    shipment_timestamp timestamp with time zone NOT NULL,
    shipments_count integer,
    CONSTRAINT mixpanel_events_shipment_event_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_event_id FOREIGN KEY (id)
        REFERENCES analytics.usage_tracker_events (id)
        ON DELETE CASCADE
);

ALTER TABLE analytics."mixpanel_events_shipment" OWNER TO heyspace;

--
-- Name: mixpanel_users_shipment; Type: TABLE; Schema: analytics; Owner: heyspace
--

CREATE TABLE analytics."mixpanel_users_shipment"
(
    id uuid NOT NULL,
    shipment_successful boolean NOT NULL,
    shipment_timestamp timestamp with time zone NOT NULL,
    shipments_count integer,
    CONSTRAINT mixpanel_users_shipment_user_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_event_actor_user_id FOREIGN KEY (id)
        REFERENCES core.user (id)
        ON DELETE CASCADE
);

ALTER TABLE analytics."mixpanel_users_shipment" OWNER TO heyspace;

--
-- Name: intercom_events_shipment; Type: TABLE; Schema: analytics; Owner: heyspace
--

CREATE TABLE analytics."intercom_events_shipment"
(
    id uuid NOT NULL,
    shipment_successful boolean NOT NULL,
    shipment_timestamp timestamp with time zone NOT NULL,
    shipments_count integer NOT NULL,
    CONSTRAINT intercom_events_shipment_event_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_event_id FOREIGN KEY (id)
        REFERENCES analytics.usage_tracker_events (id)
        ON DELETE CASCADE
);

ALTER TABLE analytics."intercom_events_shipment" OWNER TO heyspace;

--
-- Name: intercom_users_shipment; Type: TABLE; Schema: analytics; Owner: heyspace
--

CREATE TABLE analytics."intercom_users_shipment"
(
    id uuid NOT NULL,
    shipment_successful boolean NOT NULL,
    shipment_timestamp timestamp with time zone NOT NULL,
    shipments_count integer,
    CONSTRAINT intercom_users_shipment_user_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_event_actor_user_id FOREIGN KEY (id)
        REFERENCES core.user (id)
        ON DELETE CASCADE
);

ALTER TABLE analytics."intercom_users_shipment" OWNER TO heyspace;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: heyspace
--

GRANT ALL ON SCHEMA public TO PUBLIC;

--
-- PostgreSQL database dump complete
--


CREATE TABLE core.schema_version
(
    version_code character varying(100) NOT NULL,
    upgraded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT version_code_pkey PRIMARY KEY (version_code)
);

ALTER TABLE core.schema_version
    OWNER to heyspace;


CREATE OR REPLACE FUNCTION core.check_schema_version(
	previousVersion text, newVersion text)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
	BEGIN
    IF not exists(select version_code from core.schema_version where version_code = previousVersion) THEN
			RAISE EXCEPTION 'Alter (%) needs version: (%) to be installed in first!', newVersion, previousVersion;
		END IF;
		IF exists(select version_code from core.schema_version where version_code = newVersion) THEN
			RAISE EXCEPTION 'Alter (%) already installed!', newVersion;
		END IF;
	end;

$BODY$;

CREATE SCHEMA stats;


ALTER SCHEMA stats OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.approximate_row_count_by_table
AS SELECT n.nspname AS schemaname,
    c.relname,
    c.reltuples
   FROM pg_class c
     LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE (n.nspname <> ALL (ARRAY['pg_catalog'::name, 'information_schema'::name])) AND c.relkind = 'r'::"char"
  ORDER BY c.reltuples DESC;

ALTER VIEW stats.approximate_row_count_by_table OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.online_user_count
AS SELECT count(DISTINCT user_session.user_id) AS online_user_count
   FROM core.user_session
  WHERE user_session.finished_at IS NULL;

ALTER VIEW stats.online_user_count OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.online_user_count_non_timecamp
AS SELECT count(*) AS online_user_count_non_timecamp
   FROM ( SELECT "substring"("user".email::text, '@(.*)$'::text) AS email_domain
           FROM core.user_online
             JOIN core."user" ON "user".id = user_online.user_id) x
  WHERE x.email_domain <> 'timecamp.com'::text AND x.email_domain <> 'hey.space'::text;

ALTER VIEW stats.online_user_count_non_timecamp OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.organization_count
AS SELECT count(*) AS organization_count
   FROM core.organization;

ALTER VIEW stats.organization_count OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.user_count
AS SELECT count(*) AS user_count
   FROM core."user";

ALTER VIEW stats.user_count OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.user_count_non_timecamp
AS SELECT count(*) AS user_count_non_timecamp
   FROM ( SELECT "substring"("user".email::text, '@(.*)$'::text) AS email_domain
           FROM core."user") x
  WHERE x.email_domain <> 'timecamp.com'::text AND x.email_domain <> 'hey.space'::text;

ALTER VIEW stats.user_count_non_timecamp OWNER TO heyspace;

CREATE OR REPLACE VIEW stats.workspace_count_with_x_messages
AS SELECT foo.mon,
    count(DISTINCT foo.organization_id) AS count
   FROM ( SELECT to_char(m.created_at, 'YYYY-MM'::text) AS mon,
            m.organization_id
           FROM messages.message m
          GROUP BY (to_char(m.created_at, 'YYYY-MM'::text)), m.organization_id
         HAVING count(m.id) > 50) foo
  GROUP BY foo.mon;

ALTER VIEW stats.workspace_count_with_x_messages OWNER TO heyspace;


ALTER FUNCTION core.check_schema_version(text, text)
    OWNER TO heyspace;

INSERT INTO core.schema_version(version_code) VALUES ('1.0.0');

\if :{?APP_DB_USER}
GRANT USAGE ON SCHEMA analytics, core, notifications, "project-management", auth, messages, stats TO :"APP_DB_USER";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytics, core, notifications, "project-management", auth, messages, stats TO :"APP_DB_USER";
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA analytics, core, notifications, "project-management", auth, messages, stats TO :"APP_DB_USER";
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics, core, notifications, "project-management", auth, messages, stats
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"APP_DB_USER";
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics, core, notifications, "project-management", auth, messages, stats
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO :"APP_DB_USER";
\endif
