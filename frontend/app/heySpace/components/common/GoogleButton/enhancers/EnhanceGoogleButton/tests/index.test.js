import React from "react";
import { shallow, mount } from "enzyme";
import EnhanceGoogleButton from "../index";
import { doNothing } from "common/utils";
import { createMockStore } from "redux-test-utils";
import { shallowWithStore } from "enzyme-redux";
import stateMock from "stateMock";

import { onSignInWithGoogleAccount } from "models/domain/CurrentUserModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

describe("<EnhanceGoogleButton>", () => {
  const store = createMockStore(stateMock);
  const Enhancer = EnhanceGoogleButton(BaseComponent);

  it("render", () => {
    const wrapper = shallowWithStore(<Enhancer />, store);

    expect(wrapper).toMatchSnapshot();
  });

  it("onClick", () => {
    const onClick = jest.fn();

    const wrapper = shallowWithStore(<Enhancer onClick={onClick} />, store);

    wrapper.dive().instance().onClick();

    expect(onClick).toHaveBeenCalled();
    expect(
      store.isActionTypeDispatched(onSignInWithGoogleAccount().type)
    ).toBeTruthy();
  });
});
