  --
  -- ALTER: 1.44.0
  -- DATE: 05.07.2018
  -- FEATURES: 
  -- added icon dictionaries
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE previousVersion text = '1.43.2';
DECLARE newVersion text = '1.44.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
PERFORM dictionaries.create_dict('project_icon_type', 'text');
INSERT INTO dictionaries.project_icon_type (value, label) VALUES 
('PenFancy','Pen Fancy'),
('Trophy', 'Trophy'),
('MugHot', 'Mug Hot'),
('SackDollar', 'Sack Dollar'),
('PaperclipVertical', 'Paperclip Vertical'),
('FloppyDisk', 'Floppy Disk'),
('BusinessTime', 'Business Time'),
('BullseyeArrow', 'Bullseye Arrow'),
('Envelope', 'Envelope');

ALTER TABLE "project-management".project ADD icon_type character varying(20) NULL;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;