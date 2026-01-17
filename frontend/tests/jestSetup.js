import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { shallow, render, mount } from 'enzyme'
global.shallow = shallow
global.render = render
global.mount = mount

console.error = message => {
  throw new Error(message)
};
