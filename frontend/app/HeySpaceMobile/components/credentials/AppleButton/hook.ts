import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  onSignInWithAppleAccount,
  onSignUpWithAppleAccount,
} from "common/models/domain/CurrentUserModel/actions";
import { AppleButtonInterface } from ".";
import handleError from "common/utils/handleError";
import isDev from "common/utils/isDevEnv";

export type AppleButtonHookInterface = {
  buttonType: AppleButton.Type;
  onAppleButtonPress: VoidFunction;
};

export default function useComponent(
  props: AppleButtonInterface
): AppleButtonHookInterface {
  let buttonType = props.buttonType;

  const dispatch = useDispatch();

  const onAuthenticateWithApple = useCallback(
    (token: string, firstName: string, lastName: string) => {
      dispatch(onSignInWithAppleAccount({ token, firstName, lastName }));
    },
    [dispatch]
  );

  const onCreateAccountWithApple = useCallback(
    (token: string, firstName: string, lastName: string) => {
      dispatch(onSignUpWithAppleAccount({ token, firstName, lastName }));
    },
    [dispatch]
  );

  const onAppleButtonPress = async () => {
    // performs login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, fullName } = appleAuthRequestResponse;

      if (!isDev()) {
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user
        );

        // use credentialState response to ensure the user is authenticated
        if (credentialState !== appleAuth.State.AUTHORIZED) {
          throw new Error("User not authorized with Apple");
        }
      }

      if (props.buttonType === AppleButton.Type.SIGN_IN) {
        onAuthenticateWithApple(
          identityToken,
          fullName.givenName,
          fullName.familyName
        );
      } else {
        onCreateAccountWithApple(
          identityToken,
          fullName.givenName,
          fullName.familyName
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  return {
    buttonType,
    onAppleButtonPress,
  };
}
