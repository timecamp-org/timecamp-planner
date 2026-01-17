import React from 'react';
import MyTasksHeader from './index'

export default { 
  title: 'myTasks/MyTasksHeader' ,
};

export const header = () => <MyTasksHeader filterId={'filter::001'} selfConversationProjectId={'project:001'} />;
