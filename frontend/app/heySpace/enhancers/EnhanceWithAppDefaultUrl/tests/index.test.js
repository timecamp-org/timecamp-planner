import React from "react";
import EnhanceInvitationForm from "../index";
import { createMockStore } from "redux-test-utils";
import { shallowWithStore } from "enzyme-redux";
import stateMock from "stateMock";

import BaseComponent from "commonEnhancers/BaseComponent";

describe("<EnhanceInvitationForm>", () => {
  const store = createMockStore(stateMock);
  const Enhancer = EnhanceInvitationForm(BaseComponent);
  const wrapper = shallowWithStore(<Enhancer />, store);

  it("render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
