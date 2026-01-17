import getEmojiRegex from 'emoji-regex';
const emojiRegex = getEmojiRegex();

export function getInitials(firstName: string, lastName: string, email?: string): string {
  let initials = '';
  const firstNameEmojiMatch = firstName && emojiRegex.exec(firstName.slice(0, 2));
  const lastNameEmojiMatch = lastName && emojiRegex.exec(lastName.slice(0, 2));

  if (firstNameEmojiMatch || lastNameEmojiMatch) {
    const firstNameEmoji = firstNameEmojiMatch && firstNameEmojiMatch[0];
    const lastNameEmoji = lastNameEmojiMatch && lastNameEmojiMatch[0];
    initials = `${firstNameEmoji || firstName.slice(0, 1)}${lastNameEmoji || lastName.slice(0, 1)}`;
  } else if (isMinimalString(firstName) && isMinimalString(lastName)) {
    initials = `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`;
  } else if (isMinimalString(lastName)) {
    initials = lastName.slice(0, 2);
  } else if (isMinimalString(firstName)) {
    initials = firstName.slice(0, 2);
  } else if (isMinimalString(email, 2)) {
    initials = email.slice(0, 2);
  } else {
    initials = '';
  }

  initials = initials.toUpperCase();

  return initials;
}

function isMinimalString(str, minLength = 1) {
  return str && str.length >= minLength;
}
