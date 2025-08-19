import React from 'react';
import Sidebar from '../components/Sidebar';
import MessageArea from '../components/MessageArea';
import getMessage from '../customHooks/getMessages';

function Home() {
 useEffect(() => {
  getMessage();
}, []);
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <Sidebar />
      <MessageArea />
    </div>
  );
}

export default Home;

