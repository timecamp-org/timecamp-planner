import { i18mark } from 'i18n/index'

export const deleteAccountFeedbackPoints = [
  {
    key: 'product_issues',
    label: i18mark('Product has issues'),
    placeholder: i18mark('What kind of issues?'),
  },
  {
    key: 'switching_to_alternative',
    label: i18mark(`I'm switching to alternative product`),
    placeholder: i18mark('Which one?'),
  },
  {
    key: 'team_not_using',
    label: i18mark(`Couldn't get my team to use it`),
    placeholder: i18mark('Why?'),
  },
  {
    key: 'not_using',
    label: i18mark(`I never got around to using it`),
    placeholder: i18mark('Why?'),
  },
  {
    key: 'product_did_not_meet_expectations',
    label: i18mark(`Product didn't do what I wanted`),
    placeholder: i18mark('Why?'),
  },
  {
    key: 'bad_experience',
    label: i18mark(`I had a bad experience`),
    placeholder: i18mark('What happened?'),
  },
]

export const cancelSubscriptionFeedbackPoints = [
  {
    key: 'product_issues',
    label: i18mark('Product has issues'),
    placeholder: i18mark('What kind of issues?'),
  },
  {
    key: 'switching_to_alternative',
    label: i18mark(`I'm switching to alternative product`),
    placeholder: i18mark('Which one? What is better in alternative?'),
  },
  {
    key: 'team_not_using',
    label: i18mark(`Couldn't get my team to use it`),
    placeholder: i18mark('Why? Did team members gave feedback?'),
  },
  {
    key: 'product_did_not_meet_expectations',
    label: i18mark(`Product didn't do what I wanted`),
    placeholder: i18mark('What was missing or wrong?'),
  },
  {
    key: 'other',
    label: i18mark(`Other`),
    placeholder: i18mark('What is the reason?'),
  },
]

