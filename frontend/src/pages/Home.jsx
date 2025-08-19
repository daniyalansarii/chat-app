import React from 'react';
import Sidebar from '../components/Sidebar';
import MessageArea from '../components/MessageArea';
import useMessages from './customHooks/useMessages';

function Home() {
 useEffect(() => {
  useMessages();
}, []);
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <Sidebar />
      <MessageArea />
    </div>
  );
}

export default Home;

