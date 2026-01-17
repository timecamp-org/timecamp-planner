import { createSelector } from 'reselect'
import { domain } from './constants'

const selectCredentialsDomain = (state) => state.get(domain)

export const selectEmail = createSelector(
  selectCredentialsDomain,
  (credentialsDomain) => credentialsDomain.get('email'),
)

export const selectPassword = createSelector(
  selectCredentialsDomain,
  (credentialsDomain) => credentialsDomain.get('password'),
)

export const selectFullName = createSelector(
  selectCredentialsDomain,
  (credentialsDomain) => credentialsDomain.get('fullName'),
)

export const selectPhone = createSelector(
  selectCredentialsDomain,
  (credentialsDomain) => credentialsDomain.get('phone'),
)

export const selectIsAcceptingTerms = createSelector(
  selectCredentialsDomain,
  (credentialsDomain) => credentialsDomain.get('isAcceptingTerms'),
)
