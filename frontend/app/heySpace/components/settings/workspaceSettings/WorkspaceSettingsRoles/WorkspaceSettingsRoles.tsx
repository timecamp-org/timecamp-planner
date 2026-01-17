import { FC, FormEvent, useState } from 'react';

import { Box, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { UserTracker } from 'common/services';
import { Id } from 'common/utils/identifier';
import { TextBadge } from 'commonComponents/Badge/textBadge';
import { Tick, X } from 'commonComponents/Icons';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { onCreateGroup, onDeleteGroup, onUpdateGroup } from 'models/domain/OrganizationGroupsModel/actions';
import { selectOrganizationGroups } from 'models/domain/OrganizationGroupsModel/selectors';
import { OrganizationGroupInterface } from 'models/domain/OrganizationGroupsModel/types';

import { Pen } from 'commonComponents/Icons/fontawesome/Pen';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import {
  addJobTitleButtonStyles,
  addedJobCellStyles,
  addedJobRowStyles,
  buttonStyles,
  tableBodyCellStyles,
  tableBodyRowStyles,
  tableBodyStyles,
  tableHeadRowStyles,
} from './muiStyles';
import styles from './styles.css';

export const WorkspaceSettingsRoles: FC = () => {
  const groups = useSelector(selectOrganizationGroups);
  const { t } = useTranslation();

  const [jobTitle, onSetJobTitle] = useState('');
  const [slug, onSetSlug] = useState('');

  const [editedJobTitle, onSetEditedJobTitle] = useState('');
  const [editedSlug, onSetEditedSlug] = useState('');

  const [isJobAdded, setIsJobAdded] = useState(false);

  const isSubmitDisabled = !jobTitle || !slug;
  const isEditSubmitDisabled = !editedJobTitle || !editedSlug;

  const [editedGroupId, onSetEditedGroupId] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    dispatch(onCreateGroup({ name: jobTitle, slug }));
    onSetJobTitle('');
    onSetSlug('');
    setIsJobAdded(false);

    UserTracker.track(UserTrackerEvent.GroupCreated);
  };

  const onEditGroup = () => {
    dispatch(
      onUpdateGroup({
        name: editedJobTitle,
        slug: editedSlug,
        id: editedGroupId,
      })
    );
    onSetEditedJobTitle('');
    onSetEditedSlug('');
    onSetEditedGroupId(null);
    UserTracker.track(UserTrackerEvent.GroupEdited);
  };

  const onRemoveGroup = (groupId: Id) => {
    dispatch(onDeleteGroup(groupId));
  };

  const onSelectEditedGroup = (group: OrganizationGroupInterface | null) => {
    if (!group) {
      onSetEditedGroupId(null);
      onSetEditedJobTitle('');
      onSetEditedSlug('');
    } else {
      onSetEditedGroupId(group.id);
      onSetEditedJobTitle(group.name);
      onSetEditedSlug(group.slug);
    }
  };

  return (
    <div className={styles.Component}>
      <div className={styles.header}>
        {t('Define job titles')}
        <TextBadge text="NEW!" />
      </div>
      <div className={styles.jobDescription}>
        <span>{t('Add job titles for your teammembers in this workspace.')}</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Table size="small" aria-label="job title table">
          <colgroup>
            <col style={{ width: '35%' }}></col>
            <col style={{ width: '35%' }}></col>
            <col style={{ width: '30%' }}></col>
          </colgroup>
          <TableHead>
            <TableRow sx={tableHeadRowStyles}>
              <TableCell>
                <span className={styles.cellHeader}>{t('Job title')}</span>
              </TableCell>
              <TableCell>
                <span className={styles.cellHeader}>{t('Acronym')}</span>
              </TableCell>
              <TableCell align={'right'}>
                <span className={styles.cellHeader}></span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={tableBodyStyles}>
            {groups.map((group) => (
              <TableRow key={group.id} sx={tableBodyRowStyles}>
                {editedGroupId !== group.id && (
                  <>
                    <TableCell component="th" scope="row">
                      {group.name}
                    </TableCell>
                    <TableCell>{group.slug}</TableCell>
                    <TableCell align={'right'} sx={tableBodyCellStyles}>
                      <div className={styles.actionsCell}>
                        <Button onClick={() => onSelectEditedGroup(group)} sx={buttonStyles} variant="text">
                          <Pen />
                        </Button>
                        <Button onClick={() => onRemoveGroup(group.id)} sx={buttonStyles} variant="text">
                          <TrashCan />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
                {editedGroupId === group.id && (
                  <>
                    <TableCell component="th" scope="row">
                      <UserInput
                        placeholder="Job title"
                        type="text"
                        name="role"
                        value={editedJobTitle}
                        className={styles.editedInput}
                        innerClassName={styles.editedInput}
                        onChange={(event) => onSetEditedJobTitle(event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <UserInput
                        placeholder="Shortcut"
                        type="text"
                        name="shortcut"
                        value={editedSlug}
                        className={styles.editedInput}
                        innerClassName={styles.editedInput}
                        onChange={(event) => onSetEditedSlug(event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className={styles.actionsCell}>
                        <Button onClick={onEditGroup} disabled={isEditSubmitDisabled} sx={buttonStyles} variant="text">
                          <Tick />
                        </Button>
                        <Button onClick={() => onSelectEditedGroup(null)} sx={buttonStyles} variant="text">
                          <X />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {isJobAdded ? (
              <TableRow key={'blueprint'} sx={addedJobRowStyles}>
                <TableCell component="th" scope="row">
                  <UserInput
                    placeholder="Job title"
                    className={styles.editedInput}
                    innerClassName={styles.editedInput}
                    type="text"
                    name="role"
                    value={jobTitle}
                    onChange={(event) => onSetJobTitle(event.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <UserInput
                    className={styles.editedInput}
                    innerClassName={styles.editedInput}
                    placeholder="Shortcut"
                    type="text"
                    name="shortcut"
                    value={slug}
                    onChange={(event) => onSetSlug(event.target.value)}
                  />
                </TableCell>
                <TableCell sx={addedJobCellStyles}>
                  <Button type="submit" disabled={isSubmitDisabled} sx={buttonStyles}>
                    {t('Create')}
                  </Button>
                  <Button
                    onClick={() => {
                      onSetJobTitle('');
                      onSetSlug('');
                      setIsJobAdded(false);
                    }}
                    sx={buttonStyles}
                  >
                    {t('Cancel')}
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <Box
                sx={addJobTitleButtonStyles}
                onClick={() => {
                  setIsJobAdded(true);
                }}
              >
                <Plus />
                {t('Add job title')}
              </Box>
            )}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};
