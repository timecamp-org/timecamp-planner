import { UserProfile, BasicGoogleProfile, BasicMobileGoogleProfile } from "./types";

export function parseBasicProfileToUserProfile(basicProfile: BasicGoogleProfile): UserProfile {
  const name = basicProfile.getName()
  const [firstName, lastName] = name.split(' ')
  return {
    email: basicProfile.getEmail(),
    avatar: basicProfile.getImageUrl(),
    displayName: basicProfile.getGivenName(),
    firstName,
    lastName,
  }
}

export function parseUserInfoToUserProfile(userInfo: BasicMobileGoogleProfile): UserProfile {
  const { idToken, user } = userInfo
  const { email, givenName, familyName, photo, name } = user 
  return {
    idToken,
    email,
    avatar: photo,
    displayName: name,
    firstName: givenName,
    lastName: familyName,
  }
}
