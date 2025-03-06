import React from 'react';
import Players from './Players';
import Tournaments from './Tournaments';

const Settings: React.FC = () => {
  return (
    <div className='flex-col w-full'>
      <Tournaments />
      <Players />
    </div>
  );
};

export default Settings;